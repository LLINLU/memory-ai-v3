// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ---------- domain types ----------
interface BareNode {
  name: string;
  description?: string;
  children: BareNode[];
}

interface ModelTree {
  root: BareNode;
  reasoning?: string;
  layer_config?: string[];
  scenario_inputs?: { what: null; who: null; where: null; when: null };
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

// ----- original prompt, only code-block instructions removed -----
const makePrompt = (theme: string) => `
    <SEARCH_THEME> ＝ ${theme}
<CONTEXT>      ＝ None

あなたは <SEARCH_THEME> の専門家です。  
シナリオ → 目的 → 機能 → 技術という 4階層以上のツリーを **JSON形式** で出力してください。
階層深さ・ノード数は論理が尽きるまで可変とし、
「どの階層でも *すべて同数* になる固定パターンは禁止」です。

────────────────────────────────────
【 内部思考（ユーザー非公開）】

0-A　<SEARCH_THEME> を 5 語以内で要約し核心概念を抽出。  
0-B　概念から **活用シナリオ** を重複なく列挙。  
　　 ★最初は多めに洗い出し（7 件以上可）、重複・冗長を削りつつ 3〜7 件に整える。  
0-C　各シナリオで再帰的ブレーンストーミング：  
　　① 目的を Mutually Exclusive and Collectively Exhaustive（MECE) に分割します → 機能を列挙（≥3 件、個数非固定）。  
　　② 機能ごとに **中核技術 1 件** を決定し、  
　　　　必要な **補完技術 1 件以上・可変** を漏れなく列挙。  
　　③ 各技術を「さらに要素技術へ分解できるか？」と自問し、  
　　　　可能な限り掘り下げ（第 5 階層以降）。  
0-D　全階層を再点検し MECE と "非固定数" を確認し調整。 

────────────────────────────────────
【 出力仕様 】
◆ ルートは **1 つの JSON オブジェクト**。
  "root" オブジェクト  
  　• name: "Search Theme: ${theme}" で始める。  
  　• description: ルート概要（英語か日本語いずれでも可）。  
  　• children: 子ノード配列（以下同様の再帰構造）。
◆ 各ノードは
   { "name": string, "description": string, "children": [] }
   だけを含むこと。**id や axis は自動生成されるため不要**。
◆ ルート name は必ず "Search Theme: ${theme}" で始める。
◆ 末端ノードは children: []。


────────────────────────────────────
【 子ノード配列の各階層の定義 】
• 第1階層 … <検索テーマ> を活用した「〜というシナリオ」
• 第2階層 … シナリオを達成する「〜という目的」
• 第3階層 … 目的を構成する「〜という機能」
• 第4階層 … 機能を実現する技術  
    - 1 行目＝中核技術（テーマ固有）  
    - 2 行目以降＝補完技術（≧1、数は可変）  
• 第5階層以降 … 要素技術を必要なだけネスト（深さ・個数可変）

────────────────────────────────────
【 禁止事項 】
• 「主技術」「補完技術」「という技術」等の冗長語
• テーマ固有でない汎用部品が中核技術に混在

────────────────────────────────────
【 MECE & 非固定数セルフチェック 】
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
    const { searchTheme } = await req.json();
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

    /*──────── OpenAI ────────*/
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
            content: "You are a structured, concise assistant.",
          },
          { role: "user", content: makePrompt(searchTheme) },
        ],
      }),
    });    if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
    const gpt = await oa.json();
    
    // Debug: Log the raw response
    console.log("Raw OpenAI response:", JSON.stringify(gpt.choices[0].message.content, null, 2));
      const parsedResponse = JSON.parse(
      gpt.choices[0].message.content
    );
    
    // Debug: Log the parsed response
    console.log("Parsed response:", JSON.stringify(parsedResponse, null, 2));
    
    // Handle both formats: direct tree structure or wrapped in root
    let treeRoot: BareNode;
    if (parsedResponse.root && parsedResponse.root.children) {
      // Standard format: { root: { name, description, children } }
      treeRoot = parsedResponse.root;
    } else if (parsedResponse.name && parsedResponse.children) {
      // Direct format: { name, description, children }
      treeRoot = parsedResponse;
    } else {
      console.error("Invalid tree structure. Expected root.children or direct tree, got:", parsedResponse);
      throw new Error("Model returned malformed tree");
    }    // Calculate maximum depth and generate dynamic layer_config
    const calculateMaxDepth = (node: BareNode, currentDepth = 0): number => {
      if (!node.children || node.children.length === 0) return currentDepth;
      return Math.max(
        ...node.children.map((child) =>
          calculateMaxDepth(child, currentDepth + 1)
        )
      );
    };

    const maxDepth = calculateMaxDepth(treeRoot);
    const dynamicLayerConfig: string[] = [];
    // Generate layer config based on actual tree depth
    // Level 1 = Scenario, Level 2 = Purpose, Level 3 = Function, Level 4 = Measure, Level 5+ = Measure2, Measure3...
    for (let i = 1; i <= maxDepth + 1; i++) { // +1 because we count levels starting from 1
      dynamicLayerConfig.push(detectAxis(i - 1)); // Convert to 0-based for detectAxis
    }

    /*──────── Supabase ────────*/
    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);    // 1️⃣ technology_trees - Save root metadata only
    const { data: tt, error: ttErr } = await sb
      .from("technology_trees")
      .insert({
        name: treeRoot.name,
        description: treeRoot.description ?? "",
        search_theme: searchTheme,
        reasoning:
          parsedResponse.reasoning ??
          `Generated technology tree for: ${searchTheme}`,
        layer_config: dynamicLayerConfig,
        scenario_inputs: parsedResponse.scenario_inputs ?? {
          what: null,
          who: null,
          where: null,
          when: null,
        },
      })
      .select("id")
      .single();
    if (ttErr) throw new Error(`DB error (tree): ${ttErr.message}`);    // 2️⃣ Insert root node at level 0
    const rootNodeId = crypto.randomUUID();
    const { error: rootError } = await sb.from("tree_nodes").insert({
      id: rootNodeId,
      tree_id: tt.id,
      parent_id: null,
      name: treeRoot.name,
      description: treeRoot.description ?? "",
      axis: "Root" as any, // Root level doesn't have a specific axis
      level: 0,
      node_order: 0,
      children_count: treeRoot.children.length,
      // path will be automatically set by the database trigger
    });
    if (rootError) throw new Error(`DB error (root node): ${rootError.message}`);

    // 3️⃣ tree_nodes recursion - Start with scenarios as level 1
    const saveNode = async (
      node: BareNode,
      parent: string | null,
      lvl = 1, // Start at level 1 for scenarios
      idx = 0
    ) => {
      const id = crypto.randomUUID();

      // Map levels to correct axis:
      // Level 1 → Scenario, Level 2 → Purpose, Level 3 → Function, Level 4 → Measure, Level 5+ → Measure2, Measure3...
      const axisForLevel = detectAxis(lvl - 1); // lvl 1 maps to axis[0] = "Scenario"

      const { error } = await sb.from("tree_nodes").insert({
        id,
        tree_id: tt.id,
        parent_id: parent,
        name: node.name,
        description: node.description ?? "",
        axis: axisForLevel as any, // Cast to handle enum type
        level: lvl,
        node_order: idx,
        children_count: node.children.length,
        // path will be automatically set by the database trigger
      });
      if (error) throw new Error(`DB error (node): ${error.message}`);

      // Recursively save children
      for (let i = 0; i < node.children.length; i++) {
        await saveNode(node.children[i], id, lvl + 1, i);
      }
    };

    // Save scenarios (children of root) as level 1 nodes with root node as parent
    for (let i = 0; i < treeRoot.children.length; i++) {
      await saveNode(treeRoot.children[i], rootNodeId, 1, i);
    }

    return new Response(JSON.stringify({ success: true, treeId: tt.id }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message ?? "unknown" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
