// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// =============================================================================
// TYPE DEFINITIONS (Inlined from api-specifications/python-api-types.ts)
// =============================================================================

interface ScenarioTreeInput {
  treeId: string;
  scenarioNode: TreeNodeInput;
}

interface TreeNodeInput {
  id: string;
  title: string;
  description?: string;
  level: number;
  children: TreeNodeInput[];
  keywords?: string[];
  context?: string;
}

interface EnrichedScenarioResponse {
  treeId: string;
  scenarioNode: EnrichedTreeNode;
}

interface EnrichedTreeNode {
  id: string;
  title: string;
  description?: string;
  level: number;
  papers: Paper[];
  useCases: UseCase[];
  children: EnrichedTreeNode[];
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string;
  citations: number;
  region: string;
  doi: string;
  url: string;
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  releases: number;
  pressReleases: Array<{
    title: string;
    url: string;
    date?: string;
  }>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Save papers for a specific node
 */
async function saveNodePapers(
  supabaseClient: any,
  nodeId: string,
  treeId: string,
  papers: Paper[],
  teamId: string | null
): Promise<void> {
  if (papers.length === 0) return;

  const papersToInsert = papers.map((paper) => ({
    id: paper.id,
    node_id: nodeId,
    tree_id: treeId,
    title: paper.title,
    authors: paper.authors,
    journal: paper.journal,
    tags: paper.tags,
    abstract: paper.abstract,
    date: paper.date,
    citations: paper.citations,
    region: paper.region,
    doi: paper.doi,
    url: paper.url,
    team_id: teamId,
  }));

  const { error } = await supabaseClient
    .from("node_papers")
    .insert(papersToInsert);

  if (error) {
    throw new Error(
      `Failed to save papers for node ${nodeId}: ${error.message}`
    );
  }

  console.log(`[DB] Saved ${papers.length} papers for node: ${nodeId}`);
}

/**
 * Save use cases for a specific node
 */
async function saveNodeUseCases(
  supabaseClient: any,
  nodeId: string,
  treeId: string,
  useCases: UseCase[],
  teamId: string | null
): Promise<void> {
  if (useCases.length === 0) return;

  for (const useCase of useCases) {
    const { error: useCaseError } = await supabaseClient
      .from("node_use_cases")
      .insert({
        id: useCase.id,
        node_id: nodeId,
        tree_id: treeId,
        title: useCase.title,
        description: useCase.description,
        releases: useCase.releases,
        team_id: teamId,
      });

    if (useCaseError) {
      throw new Error(
        `Failed to save use case for node ${nodeId}: ${useCaseError.message}`
      );
    }

    if (useCase.pressReleases.length > 0) {
      const pressReleasesToInsert = useCase.pressReleases.map((pr) => ({
        use_case_id: useCase.id,
        title: pr.title,
        url: pr.url,
        date: pr.date,
      }));

      const { error: prError } = await supabaseClient
        .from("use_case_press_releases")
        .insert(pressReleasesToInsert);

      if (prError) {
        throw new Error(
          `Failed to save press releases for use case ${useCase.id}: ${prError.message}`
        );
      }
    }
  }

  console.log(`[DB] Saved ${useCases.length} use cases for node: ${nodeId}`);
}

/**
 * Mock Python API call for tree enrichment
 */
async function callPythonEnrichmentAPI(
  scenarioTree: ScenarioTreeInput
): Promise<EnrichedScenarioResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`[MOCK API] Processing tree: ${scenarioTree.treeId}`);
  console.log(`[MOCK API] Scenario: ${scenarioTree.scenarioNode.title}`);

  const enrichedNode = enrichNodeWithMockData(scenarioTree.scenarioNode);

  return {
    treeId: scenarioTree.treeId,
    scenarioNode: enrichedNode,
  };
}

function enrichNodeWithMockData(node: any): any {
  const papers = generateMockPapers(node.title, node.level);
  const useCases = generateMockUseCases(node.title, node.level);

  const enrichedChildren = node.children.map((child: any) =>
    enrichNodeWithMockData(child)
  );

  return {
    ...node,
    papers,
    useCases,
    children: enrichedChildren,
  };
}

function generateMockPapers(nodeTitle: string, level: number): Paper[] {
  const paperCount = Math.floor(Math.random() * 5) + 1;
  const papers: Paper[] = [];

  for (let i = 0; i < paperCount; i++) {
    const paperId = crypto.randomUUID();
    papers.push({
      id: paperId,
      title: `${nodeTitle}: Research Paper ${i + 1}`,
      authors: generateMockAuthors(),
      journal: generateMockJournal(),
      tags: generateMockTags(nodeTitle),
      abstract: `This paper explores advanced techniques in ${nodeTitle.toLowerCase()}. The research demonstrates significant improvements in performance and efficiency through innovative approaches.`,
      date: generateRandomDate(),
      citations: Math.floor(Math.random() * 200) + 10,
      region: Math.random() > 0.5 ? "international" : "domestic",
      doi: `10.1000/mock.${paperId.split("-")[0]}`,
      url: `https://example.com/paper/${paperId}`,
    });
  }

  return papers;
}

function generateMockUseCases(nodeTitle: string, level: number): UseCase[] {
  const useCaseCount = Math.floor(Math.random() * 3) + 1;
  const useCases: UseCase[] = [];

  for (let i = 0; i < useCaseCount; i++) {
    const useCaseId = crypto.randomUUID();
    const releases = Math.floor(Math.random() * 15) + 1;

    const prCount = Math.min(releases, 3);
    const pressReleases: Array<{ title: string; url: string; date?: string }> =
      [];

    for (let j = 0; j < prCount; j++) {
      pressReleases.push({
        title: `${nodeTitle} Implementation Milestone ${j + 1}`,
        url: `https://example.com/press-release/${useCaseId}-${j}`,
        date: generateRandomDate(),
      });
    }

    useCases.push({
      id: useCaseId,
      title: `${nodeTitle} Implementation Case ${i + 1}`,
      description: `Real-world implementation of ${nodeTitle.toLowerCase()} technology demonstrating practical applications and measurable results.`,
      releases,
      pressReleases,
    });
  }

  return useCases;
}

function generateMockAuthors(): string {
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eric", "Fiona"];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
  ];

  const authorCount = Math.floor(Math.random() * 3) + 1;
  const authors: string[] = [];

  for (let i = 0; i < authorCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    authors.push(`${firstName} ${lastName}`);
  }

  return authors.join(", ");
}

function generateMockJournal(): string {
  const journals = [
    "Nature Technology",
    "Science Advances",
    "IEEE Transactions on Technology",
    "Journal of Applied Sciences",
    "Technology Review",
  ];

  return journals[Math.floor(Math.random() * journals.length)];
}

function generateMockTags(nodeTitle: string): string[] {
  const baseTags = ["research", "innovation", "technology"];
  const specificTags = nodeTitle.toLowerCase().split(" ").slice(0, 3);
  return [...baseTags, ...specificTags].slice(0, 5);
}

function generateRandomDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString().split("T")[0];
}

// Helper function to assign unique IDs to subtree nodes for API consistency
function assignIdsToSubtree(nodes: BareNode[], startLevel: number = 2): any[] {
  console.log(
    `[ASSIGN_IDS] Processing ${nodes.length} nodes at level ${startLevel}`
  );

  return nodes.map((node, index) => {
    const id = crypto.randomUUID();
    console.log(
      `[ASSIGN_IDS] Assigning ID ${id} to node "${node.name}" at level ${startLevel}`
    );

    const result = {
      id,
      title: node.name,
      description: node.description || "",
      level: startLevel,
      children: assignIdsToSubtree(node.children, startLevel + 1),
    };

    console.log(
      `[ASSIGN_IDS] Node "${node.name}" has ${node.children.length} children`
    );
    return result;
  });
}

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
    const requestBody = await req.json();
    console.log(`[MAIN] Received request:`, {
      method: req.method,
      step: requestBody.step,
      hasSearchTheme: !!requestBody.searchTheme,
      hasScenarioId: !!requestBody.scenarioId,
      hasTeamId: !!requestBody.team_id,
    });

    const { searchTheme, team_id, step, scenarioId } = requestBody;

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

      console.log(
        `[STEP 1] Created ${scenarios.length} scenarios, starting Step 2 generation`
      );

      // Start Step 2 generation for each scenario asynchronously with proper error handling
      const step2Promises = scenarios.map(async (scenario) => {
        try {
          console.log(
            `[STEP 1] Starting Step 2 for scenario: ${scenario.name} (ID: ${scenario.id})`
          );

          const step2Response = await fetch(req.url, {
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

          if (!step2Response.ok) {
            const errorText = await step2Response.text();
            console.error(
              `[STEP 1] Step 2 failed for scenario ${scenario.name}:`,
              {
                status: step2Response.status,
                statusText: step2Response.statusText,
                error: errorText,
              }
            );
            throw new Error(
              `Step 2 failed: ${step2Response.status} - ${errorText}`
            );
          }

          const step2Result = await step2Response.json();
          console.log(
            `[STEP 1] Step 2 completed for scenario: ${scenario.name}`,
            step2Result
          );
          return {
            scenario: scenario.name,
            success: true,
            result: step2Result,
          };
        } catch (error) {
          console.error(
            `[STEP 1] Error in Step 2 for scenario ${scenario.name}:`,
            {
              message: error.message,
              stack: error.stack,
            }
          );
          return {
            scenario: scenario.name,
            success: false,
            error: error.message,
          };
        }
      });

      // Don't wait for all Step 2 to complete - let them run in background
      console.log(
        `[STEP 1] Initiated ${step2Promises.length} Step 2 processes`
      );

      // Start the processes but don't await them - they'll complete asynchronously
      Promise.all(step2Promises)
        .then((results) => {
          const successful = results.filter((r) => r.success).length;
          const failed = results.filter((r) => !r.success).length;
          console.log(
            `[STEP 1] All Step 2 processes completed: ${successful} successful, ${failed} failed`
          );
          if (failed > 0) {
            console.error(
              `[STEP 1] Failed scenarios:`,
              results.filter((r) => !r.success)
            );
          }
        })
        .catch((error) => {
          console.error(`[STEP 1] Error waiting for Step 2 completion:`, error);
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
    } // ===============================
    // STEP 2: Generate Subtree for specific scenario
    // ===============================
    else if (step === 2) {
      console.log(`[STEP 2] === STEP 2 ENTRY POINT ===`);
      console.log(`[STEP 2] Raw request body:`, requestBody);

      const { scenarioName, scenarioDescription, treeId } = requestBody;

      console.log(`[STEP 2] Starting Step 2 with params:`, {
        scenarioId,
        scenarioName,
        scenarioDescription,
        treeId,
        team_id,
      });

      if (!scenarioId || !scenarioName || !treeId) {
        console.error(`[STEP 2] Missing required parameters:`, {
          scenarioId: !!scenarioId,
          scenarioName: !!scenarioName,
          treeId: !!treeId,
        });
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

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(gpt.choices[0].message.content);
        console.log(
          `[STEP 2] Parsed OpenAI response structure:`,
          Object.keys(parsedResponse)
        );
      } catch (parseError) {
        console.error(`[STEP 2] Failed to parse OpenAI response:`, parseError);
        throw new Error(
          `Failed to parse OpenAI response: ${parseError.message}`
        );
      }

      // Handle children array format (no scenario wrapper needed)
      let purposeNodes: BareNode[];
      if (parsedResponse.children && Array.isArray(parsedResponse.children)) {
        purposeNodes = parsedResponse.children;
        console.log(
          `[STEP 2] Using direct children array, found ${purposeNodes.length} purpose nodes`
        );
      } else if (parsedResponse.subtree && parsedResponse.subtree.children) {
        // Fallback: if model still returns subtree format, extract children
        purposeNodes = parsedResponse.subtree.children;
        console.log(
          `[STEP 2] Using subtree.children, found ${purposeNodes.length} purpose nodes`
        );
      } else if (parsedResponse.name && parsedResponse.children) {
        // Fallback: if model returns scenario node, extract children
        purposeNodes = parsedResponse.children;
        console.log(
          `[STEP 2] Using scenario.children, found ${purposeNodes.length} purpose nodes`
        );
      } else {
        console.error(
          `[STEP 2] Invalid subtree structure for ${scenarioName}. Available keys:`,
          Object.keys(parsedResponse)
        );
        console.error(`[STEP 2] Full response:`, parsedResponse);
        throw new Error("Model returned malformed subtree");
      } /*──────── Python API Enrichment ────────*/
      console.log(`=== Calling Python API for enrichment: ${scenarioName} ===`);

      // Prepare subtree data for Python API
      console.log(
        `[STEP 2] Assigning IDs to ${purposeNodes.length} purpose nodes`
      );
      const subtreeWithIds = assignIdsToSubtree(purposeNodes);
      console.log(`[STEP 2] Assigned IDs, building scenario tree input`);

      const scenarioTreeInput = {
        treeId,
        scenarioNode: {
          id: scenarioId,
          title: scenarioName,
          description: scenarioDescription,
          level: 1,
          children: subtreeWithIds,
        },
      };

      console.log(`[STEP 2] Scenario tree input prepared:`, {
        treeId,
        scenarioNodeId: scenarioId,
        childrenCount: subtreeWithIds.length,
      });

      // Call Python API for enrichment (mock for now)
      console.log(`[STEP 2] Calling enrichment API...`);
      const enrichedResponse = await callPythonEnrichmentAPI(scenarioTreeInput);
      console.log(
        `=== Enrichment completed for: ${scenarioName} ===`
      ); /*──────── Save Enriched Data to Supabase ────────*/
      console.log(
        `[STEP 2] Starting to save ${purposeNodes.length} purpose nodes to database`
      );

      // Save subtree nodes with enriched data
      const saveSubtreeWithEnrichment = async (
        bareNode: BareNode,
        enrichedNode: any,
        parentId: string,
        lvl: number,
        idx: number
      ) => {
        const id = enrichedNode.id || crypto.randomUUID();
        const axisForLevel = detectAxis(lvl); // FIXED: was lvl - 1, now just lvl

        console.log(`[SAVE] Saving node at level ${lvl}:`, {
          id,
          name: bareNode.name,
          parentId,
          axis: axisForLevel,
          level: lvl,
          order: idx,
          childrenCount: bareNode.children.length,
        });

        // Validate axis value exists in enum
        const validAxisValues = [
          "Root",
          "Scenario",
          "Purpose",
          "Function",
          "Measure",
          "Measure2",
          "Measure3",
          "Measure4",
          "Measure5",
          "Measure6",
          "Measure7",
          "Technology",
          "How1",
          "How2",
          "How3",
          "How4",
          "How5",
          "How6",
          "How7",
        ];

        if (!validAxisValues.includes(axisForLevel)) {
          console.error(
            `[SAVE] Invalid axis value: ${axisForLevel} for level ${lvl}`
          );
          throw new Error(
            `Invalid axis value: ${axisForLevel} for level ${lvl}`
          );
        }

        // Save tree node
        try {
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

          if (error) {
            console.error(`[SAVE] Database error saving node ${id}:`, error);
            throw new Error(`DB error (subtree node): ${error.message}`);
          }

          console.log(`[SAVE] Successfully saved node ${id} at level ${lvl}`);
        } catch (dbError) {
          console.error(`[SAVE] Failed to save node ${id}:`, dbError);
          throw dbError;
        }

        // Save enriched data for this node (papers and use cases)
        try {
          if (enrichedNode.papers && enrichedNode.papers.length > 0) {
            console.log(
              `[SAVE] Saving ${enrichedNode.papers.length} papers for node ${id}`
            );
            await saveNodePapers(sb, id, treeId, enrichedNode.papers, team_id);
          }
          if (enrichedNode.useCases && enrichedNode.useCases.length > 0) {
            console.log(
              `[SAVE] Saving ${enrichedNode.useCases.length} use cases for node ${id}`
            );
            await saveNodeUseCases(
              sb,
              id,
              treeId,
              enrichedNode.useCases,
              team_id
            );
          }
        } catch (enrichError) {
          console.error(
            `[SAVE] Failed to save enriched data for node ${id}:`,
            enrichError
          );
          // Don't throw here - continue with children even if enriched data fails
        }

        // Recursively save children
        console.log(
          `[SAVE] Processing ${bareNode.children.length} children for node ${id}`
        );
        for (let i = 0; i < bareNode.children.length; i++) {
          const correspondingEnrichedChild = enrichedNode.children[i];
          if (!correspondingEnrichedChild) {
            console.error(
              `[SAVE] Missing enriched child at index ${i} for node ${id}`
            );
            continue;
          }

          try {
            await saveSubtreeWithEnrichment(
              bareNode.children[i],
              correspondingEnrichedChild,
              id,
              lvl + 1,
              i
            );
          } catch (childError) {
            console.error(
              `[SAVE] Failed to save child ${i} of node ${id}:`,
              childError
            );
            throw childError; // Propagate child errors
          }
        }

        console.log(`[SAVE] Completed saving node ${id} and all its children`);
      }; // First, save enriched data for the scenario node itself (level 1)
      console.log(
        `[STEP 2] Saving enriched data for scenario node: ${scenarioId}`
      );
      try {
        if (
          enrichedResponse.scenarioNode.papers &&
          enrichedResponse.scenarioNode.papers.length > 0
        ) {
          console.log(
            `[SCENARIO] Saving ${enrichedResponse.scenarioNode.papers.length} papers for scenario`
          );
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
          console.log(
            `[SCENARIO] Saving ${enrichedResponse.scenarioNode.useCases.length} use cases for scenario`
          );
          await saveNodeUseCases(
            sb,
            scenarioId,
            treeId,
            enrichedResponse.scenarioNode.useCases,
            team_id
          );
          console.log(`[DB] Saved scenario use cases for: ${scenarioName}`);
        }
      } catch (scenarioEnrichError) {
        console.error(
          `[SCENARIO] Failed to save scenario enriched data:`,
          scenarioEnrichError
        );
        // Continue anyway - don't fail the whole process
      }

      // Then, save all children of the scenario with enrichment (starting at level 2 = Purpose)
      console.log(
        `[STEP 2] Starting to save ${purposeNodes.length} purpose nodes as children of scenario`
      );
      try {
        for (let i = 0; i < purposeNodes.length; i++) {
          const correspondingEnrichedNode =
            enrichedResponse.scenarioNode.children[i];
          if (!correspondingEnrichedNode) {
            console.error(`[STEP 2] Missing enriched node at index ${i}`);
            continue;
          }

          console.log(
            `[STEP 2] Saving purpose node ${i + 1}/${purposeNodes.length}: ${
              purposeNodes[i].name
            }`
          );
          await saveSubtreeWithEnrichment(
            purposeNodes[i],
            correspondingEnrichedNode,
            scenarioId,
            2, // Purpose level
            i
          );
          console.log(
            `[STEP 2] Successfully saved purpose node ${i + 1}/${
              purposeNodes.length
            }`
          );
        }
        console.log(`[STEP 2] Completed saving all purpose nodes`);
      } catch (saveError) {
        console.error(`[STEP 2] Failed to save purpose nodes:`, saveError);
        throw saveError;
      } // Update scenario node to set correct children_count
      console.log(
        `[STEP 2] Updating scenario node ${scenarioId} with children_count: ${purposeNodes.length}`
      );
      try {
        const { error: updateError } = await sb
          .from("tree_nodes")
          .update({
            children_count: purposeNodes.length,
          })
          .eq("id", scenarioId);
        if (updateError) {
          console.error(
            `[STEP 2] Failed to update scenario children_count:`,
            updateError
          );
          throw new Error(
            `DB error (updating scenario): ${updateError.message}`
          );
        }
        console.log(`[STEP 2] Successfully updated scenario children_count`);
      } catch (updateError) {
        console.error(`[STEP 2] Error updating scenario:`, updateError);
        throw updateError;
      }

      // Check if all scenarios are completed (have children_count > 0)
      console.log(`[STEP 2] Checking completion status for tree ${treeId}`);
      const { data: allScenarios, error: checkError } = await sb
        .from("tree_nodes")
        .select("children_count, name")
        .eq("tree_id", treeId)
        .eq("level", 1);

      if (!checkError && allScenarios) {
        const completedScenarios = allScenarios.filter(
          (s) => s.children_count > 0
        );
        const allCompleted = allScenarios.every((s) => s.children_count > 0);

        console.log(`[STEP 2] Tree completion status:`, {
          totalScenarios: allScenarios.length,
          completedScenarios: completedScenarios.length,
          allCompleted,
          scenarios: allScenarios.map((s) => ({
            name: s.name,
            children_count: s.children_count,
          })),
        });

        if (allCompleted) {
          // All scenarios now have their subtrees generated
          console.log(`Tree ${treeId}: All scenarios completed`);
        }
      } else if (checkError) {
        console.error(
          `[STEP 2] Error checking scenario completion:`,
          checkError
        );
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
    console.error("=== EDGE FUNCTION ERROR (TED v2) ===");
    console.error("Error details:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      cause: err.cause,
    });

    // Log the request details for debugging
    console.error("Request context:", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // Try to parse request body for additional context
    try {
      const requestBody = await req.clone().json();
      console.error("Request body:", requestBody);
    } catch (bodyError) {
      console.error("Could not parse request body:", bodyError.message);
    }

    console.error("=== END ERROR DETAILS ===");

    return new Response(
      JSON.stringify({
        error: err.message ?? "unknown",
        details: err.stack ?? "No stack trace available",
      }),
      {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      }
    );
  }
});
