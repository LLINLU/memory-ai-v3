// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { callPythonEnrichmentAPI } from "../shared/mock-python-api.ts";
import { saveNodePapers, saveNodeUseCases } from "../shared/database-helpers.ts";

// ---------- domain types ----------
interface BareNode {
  name: string;
  description?: string;
  children: BareNode[];
}


// Function to determine axis based on level
function detectAxis(level: number): string {
  const axisMap = ["Scenario", "Purpose", "Function", "Measure"];
  if (level < axisMap.length) {
    return axisMap[level];
  } else {
    return `Measure${level - axisMap.length + 2}`; // e.g., level 4 => Measure2, 5 => Measure3
  }
}

// ----- Step 1: Generate Root + Scenarios only -----
const makeStepOnePrompt = (theme: string) => `
<SEARCH_THEME> = ${theme}
<CONTEXT> = None

あなたは <SEARCH_THEME> の専門家です。
**第1段階**: ルート（検索テーマ）と第1階層（シナリオ）のみを生成してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【内部思考（ユーザー非公開）】

0-A　<SEARCH_THEME> を 5 語以内で要約し核心概念を抽出。
0-B　概念から **活用シナリオ** を重複なく列挙。
　　 ★最初は多めに洗い出し（7 件以上可）、重複・冗長を削りつつ 3〜7 件に整える。
0-C　各シナリオの概要説明を簡潔に記述（詳細は第2段階で展開）。
0-D　シナリオ間でMECE（重複なし・漏れなし）を確認し調整。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【出力仕様】
◆ ルートは **1 つの JSON オブジェクト**。
  "root" オブジェクト
  　• name: "Search Theme: ${theme}" で始める。
  　• description: ルート概要（英語か日本語いずれでも可）。
  　• children: シナリオ配列（第1階層のみ）。
◆ 各シナリオノードは
   { "name": string, "description": string, "children": [] }
◆ ルート name は必ず "Search Theme: ${theme}" で始める。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第1階層の定義】
• シナリオ … <検索テーマ> を活用した「〜というシナリオ」
　例: "医療現場での診断支援"、"教育分野での個別指導"など

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【禁止事項】
• 汎用的すぎるシナリオは避ける（テーマ固有にする）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【MECEセルフチェック】
□ シナリオ間で役割・内容が重複していないか
□ シナリオ総和でテーマの主要活用領域を網羅しているか

セルフチェック合格後、JSON を出力してください。
`;

// ----- Step 2: Generate subtree for a specific scenario -----
const makeStepTwoPrompt = (
  theme: string,
  scenarioName: string,
  scenarioDescription: string
) => `
<SEARCH_THEME> = ${theme}
<SCENARIO> = ${scenarioName}
<SCENARIO_DESCRIPTION> = ${scenarioDescription}
<CONTEXT> = None

あなたは <SEARCH_THEME> の専門家です。
**第2段階**: 特定のシナリオ「${scenarioName}」の詳細なサブツリーを生成してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【内部思考（ユーザー非公開）】

0-A　<SCENARIO> を達成するための目的を MECE に分割。
0-B　各目的ごとに必要な機能を列挙（≥3 件、個数非固定）。
0-C　機能ごとに **中核技術 1 件** を決定し、
　　　必要な **補完技術 1 件以上・可変** を漏れなく列挙。
0-D　各技術を「さらに要素技術へ分解できるか？」と自問し、
　　　可能な限り掘り下げ（第 5 階層以降）。
0-E　全階層を再点検し MECE と "非固定数" を確認し調整。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【出力仕様】
◆ トップレベルは **目的ノード配列**。
  "children" 配列
  　• シナリオの子ノード（目的配列）を直接出力。
  　• シナリオノード自体は含めない（既に保存済み）。
◆ 各ノードは
   { "name": string, "description": string, "children": [] }
   だけを含むこと。
◆ 末端ノードは children: []。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【各階層の定義】
• 第1階層 … シナリオを達成する「〜という目的」
• 第2階層 … 目的を構成する「〜という機能」
• 第3階層 … 機能を実現する技術
    - 1 行目＝中核技術（テーマ固有）
    - 2 行目以降＝補完技術（≧1、数は可変）
• 第4階層以降 … 要素技術を必要なだけネスト（深さ・個数可変）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【禁止事項】
• 「主技術」「補完技術」「という技術」等の冗長語
• テーマ固有でない汎用部品が中核技術に混在

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【MECE & 非固定数セルフチェック】
□ 階層内で役割・内容が重複していないか
□ 下位ノード総和で上位を完全に説明できるか
□ *ノード数がそろい過ぎ* になっていないか
□ テーマ固有でない汎用部品が中核技術に混在していないか
□ 深掘り可能な技術を途中で打ち切っていないか

セルフチェック合格後、JSON を出力してください。
`;

/*──────────────────── cors ────────────────────*/
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/*──────────────────── edge entry ────────────────*/
serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { status: 200, headers: CORS });

  try {
    const { searchTheme, team_id, step, scenarioId } = await req.json();

    if (!searchTheme)
      return new Response(
        JSON.stringify({ error: "searchTheme is required" }),
        {
          status: 400,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ROLE_KEY)
      throw new Error("Server mis-config (env vars)");

    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    // ===============================
    // STEP 1: Generate Root + Scenarios
    // ===============================
    if (step === 1 || !step) {
      console.log("=== STEP 1: Generating Root + Scenarios ===");

      /*──────── OpenAI for Step 1 ────────*/
      const oa = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a structured, concise assistant specialized in technology tree generation.",
            },
            { role: "user", content: makeStepOnePrompt(searchTheme) },
          ],
        }),
      });
      if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
      const gpt = await oa.json();

      console.log(
        "Raw OpenAI response (Step 1):",
        JSON.stringify(gpt.choices[0].message.content, null, 2)
      );
      const parsedResponse = JSON.parse(gpt.choices[0].message.content);

      // Handle both formats: direct tree structure or wrapped in root
      let treeRoot: BareNode;
      if (parsedResponse.root && parsedResponse.root.children) {
        treeRoot = parsedResponse.root;
      } else if (parsedResponse.name && parsedResponse.children) {
        treeRoot = parsedResponse;
      } else {
        console.error(
          "Invalid tree structure. Expected root.children or direct tree, got:",
          parsedResponse
        );
        throw new Error("Model returned malformed tree");
      }

      // 🔒 PROGRAMMATICALLY ENSURE SCENARIO CHILDREN ARE EMPTY
      // This guarantees no misalignment regardless of AI output
      if (treeRoot.children) {
        treeRoot.children.forEach((scenario) => {
          scenario.children = []; // Force empty children for all scenarios
        });
      }

      // Generate basic layer config for TED approach (will be updated later)
      const dynamicLayerConfig = ["Scenario", "Purpose", "Function", "Measure"];

      /*──────── Supabase Step 1 ────────*/
      // 1️⃣ technology_trees - Save root metadata
      const { data: tt, error: ttErr } = await sb
        .from("technology_trees")
        .insert({
          name: treeRoot.name,
          description: treeRoot.description ?? "",
          search_theme: searchTheme,
          reasoning:
            parsedResponse.reasoning ??
            `Generated TED tree (Step 1) for: ${searchTheme}`,
          layer_config: dynamicLayerConfig,
          scenario_inputs: parsedResponse.scenario_inputs ?? {
            what: null,
            who: null,
            where: null,
            when: null,
          },
          mode: "TED", // TED mode indicator
          team_id: team_id || null,
        })
        .select("id")
        .single();
      if (ttErr) throw new Error(`DB error (tree): ${ttErr.message}`);

      // 2️⃣ Insert root node at level 0
      const rootNodeId = crypto.randomUUID();
      const { error: rootError } = await sb.from("tree_nodes").insert({
        id: rootNodeId,
        tree_id: tt.id,
        parent_id: null,
        name: treeRoot.name,
        description: treeRoot.description ?? "",
        axis: "Root" as any,
        level: 0,
        node_order: 0,
        children_count: treeRoot.children.length,
        team_id: team_id || null,
      });
      if (rootError)
        throw new Error(`DB error (root node): ${rootError.message}`);

      // 3️⃣ Insert scenario nodes (level 1) with children_count = 0 (indicating pending generation)
      const scenarioPromises = treeRoot.children.map(async (scenario, idx) => {
        const scenarioId = crypto.randomUUID();
        const { error } = await sb.from("tree_nodes").insert({
          id: scenarioId,
          tree_id: tt.id,
          parent_id: rootNodeId,
          name: scenario.name,
          description: scenario.description ?? "",
          axis: "Scenario" as any,
          level: 1,
          node_order: idx,
          children_count: 0, // Important: Set to 0 to indicate subtree not generated yet
          team_id: team_id || null,
        });
        if (error)
          throw new Error(`DB error (scenario node): ${error.message}`);
        return {
          id: scenarioId,
          name: scenario.name,
          description: scenario.description,
        };
      });

      const scenarios = await Promise.all(scenarioPromises);

      // Start Step 2 generation for each scenario asynchronously
      scenarios.forEach(async (scenario) => {
        try {
          console.log(`=== Starting Step 2 for scenario: ${scenario.name} ===`);

          // Call Step 2 generation asynchronously
          await fetch(req.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.get("Authorization") || "",
            },
            body: JSON.stringify({
              searchTheme,
              team_id,
              step: 2,
              scenarioId: scenario.id,
              scenarioName: scenario.name,
              scenarioDescription: scenario.description,
              treeId: tt.id,
            }),
          });
        } catch (error) {
          console.error(
            `Error starting Step 2 for scenario ${scenario.name}:`,
            error
          );
        }
      });

      return new Response(
        JSON.stringify({
          success: true,
          treeId: tt.id,
          step: 1,
          scenarios: scenarios.map((s) => ({ id: s.id, name: s.name })),
        }),
        {
          status: 200,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );
    }

    // ===============================
    // STEP 2: Generate Subtree for specific scenario
    // ===============================
    else if (step === 2) {
      const { scenarioName, scenarioDescription, treeId } = await req.json();

      if (!scenarioId || !scenarioName || !treeId) {
        return new Response(
          JSON.stringify({
            error:
              "scenarioId, scenarioName, and treeId are required for step 2",
          }),
          {
            status: 400,
            headers: { ...CORS, "Content-Type": "application/json" },
          }
        );
      }

      console.log(
        `=== STEP 2: Generating subtree for scenario: ${scenarioName} ===`
      );

      /*──────── OpenAI for Step 2 ────────*/
      const oa = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a structured, concise assistant specialized in detailed technology subtree generation.",
            },
            {
              role: "user",
              content: makeStepTwoPrompt(
                searchTheme,
                scenarioName,
                scenarioDescription
              ),
            },
          ],
        }),
      });
      if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
      const gpt = await oa.json();

      console.log(
        `Raw OpenAI response (Step 2 - ${scenarioName}):`,
        JSON.stringify(gpt.choices[0].message.content, null, 2)
      );
      const parsedResponse = JSON.parse(gpt.choices[0].message.content);

      // Handle children array format (no scenario wrapper needed)
      let purposeNodes: BareNode[];
      if (parsedResponse.children && Array.isArray(parsedResponse.children)) {
        purposeNodes = parsedResponse.children;
      } else if (parsedResponse.subtree && parsedResponse.subtree.children) {
        // Fallback: if model still returns subtree format, extract children
        purposeNodes = parsedResponse.subtree.children;
      } else if (parsedResponse.name && parsedResponse.children) {
        // Fallback: if model returns scenario node, extract children
        purposeNodes = parsedResponse.children;
      } else {
        console.error(
          `Invalid subtree structure for ${scenarioName}. Expected children array, got:`,
          parsedResponse
        );
        throw new Error("Model returned malformed subtree");
      } /*──────── Python API Enrichment ────────*/
      console.log(`=== Calling Python API for enrichment: ${scenarioName} ===`);      // Prepare subtree data for Python API
      const subtreeWithIds = assignIdsToSubtree(purposeNodes);
      const scenarioTreeInput = {
        treeId,
        scenarioNode: {
          id: scenarioId,
          title: scenarioName,
          description: scenarioDescription,
          level: 1,
          children: subtreeWithIds,
        }
      };

      // Call Python API for enrichment (mock for now)
      const enrichedResponse = await callPythonEnrichmentAPI(scenarioTreeInput);
      console.log(`=== Enrichment completed for: ${scenarioName} ===`);

      /*──────── Save Enriched Data to Supabase ────────*/
      // Save subtree nodes with enriched data
      const saveSubtreeWithEnrichment = async (
        bareNode: BareNode,
        enrichedNode: any,
        parentId: string,
        lvl: number,
        idx: number
      ) => {
        const id = enrichedNode.id || crypto.randomUUID();
        const axisForLevel = detectAxis(lvl - 1); // lvl 2 maps to "Purpose", lvl 3 to "Function", etc.

        // Save tree node
        const { error } = await sb.from("tree_nodes").insert({
          id,
          tree_id: treeId,
          parent_id: parentId,
          name: bareNode.name,
          description: bareNode.description ?? "",
          axis: axisForLevel as any,
          level: lvl,
          node_order: idx,
          children_count: bareNode.children.length,
          team_id: team_id || null,
        });
        if (error) throw new Error(`DB error (subtree node): ${error.message}`);

        // Save enriched data for this node (papers and use cases)
        if (enrichedNode.papers && enrichedNode.papers.length > 0) {
          await saveNodePapers(sb, id, treeId, enrichedNode.papers, team_id);
        }
        if (enrichedNode.useCases && enrichedNode.useCases.length > 0) {
          await saveNodeUseCases(
            sb,
            id,
            treeId,
            enrichedNode.useCases,
            team_id
          );
        }

        // Recursively save children
        for (let i = 0; i < bareNode.children.length; i++) {
          const correspondingEnrichedChild = enrichedNode.children[i];
          await saveSubtreeWithEnrichment(
            bareNode.children[i],
            correspondingEnrichedChild,
            id,
            lvl + 1,
            i
          );
        }
      }; // First, save enriched data for the scenario node itself (level 1)
      if (
        enrichedResponse.scenarioNode.papers &&
        enrichedResponse.scenarioNode.papers.length > 0
      ) {
        await saveNodePapers(
          sb,
          scenarioId,
          treeId,
          enrichedResponse.scenarioNode.papers,
          team_id
        );
        console.log(`[DB] Saved scenario papers for: ${scenarioName}`);
      }
      if (
        enrichedResponse.scenarioNode.useCases &&
        enrichedResponse.scenarioNode.useCases.length > 0
      ) {
        await saveNodeUseCases(
          sb,
          scenarioId,
          treeId,
          enrichedResponse.scenarioNode.useCases,
          team_id
        );
        console.log(`[DB] Saved scenario use cases for: ${scenarioName}`);
      }

      // Then, save all children of the scenario with enrichment (starting at level 2 = Purpose)
      for (let i = 0; i < purposeNodes.length; i++) {
        const correspondingEnrichedNode =
          enrichedResponse.scenarioNode.children[i];
        await saveSubtreeWithEnrichment(
          purposeNodes[i],
          correspondingEnrichedNode,
          scenarioId,
          2,
          i
        );
      }

      // Update scenario node to set correct children_count
      const { error: updateError } = await sb
        .from("tree_nodes")
        .update({
          children_count: purposeNodes.length,
        })
        .eq("id", scenarioId);
      if (updateError)
        throw new Error(`DB error (updating scenario): ${updateError.message}`);

      // Check if all scenarios are completed (have children_count > 0)
      const { data: allScenarios, error: checkError } = await sb
        .from("tree_nodes")
        .select("children_count")
        .eq("tree_id", treeId)
        .eq("level", 1);

      if (!checkError && allScenarios) {
        const allCompleted = allScenarios.every((s) => s.children_count > 0);
        if (allCompleted) {
          // All scenarios now have their subtrees generated
          console.log(`Tree ${treeId}: All scenarios completed`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          treeId,
          scenarioId,
          step: 2,
          message: `Subtree generated for scenario: ${scenarioName}`,
        }),
        {
          status: 200,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid step parameter. Must be 1 or 2." }),
        {
          status: 400,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );
    }
  } catch (err: any) {
    console.error("Edge function error (TED v2):", err);
    return new Response(JSON.stringify({ error: err.message ?? "unknown" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

// Helper function to assign unique IDs to subtree nodes for API consistency
function assignIdsToSubtree(nodes: BareNode[]): any[] {
  return nodes.map((node) => ({
    id: crypto.randomUUID(),
    title: node.name,
    description: node.description,
    level: 2, // Starting at Purpose level
    children: assignIdsToSubtree(node.children).map((child, idx) => ({
      ...child,
      level: child.level + 1,
    })),
  }));
}
