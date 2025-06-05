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

// Function to determine axis based on level for FAST approach
function detectAxisFast(level: number): string {
  if (level === 0) {
    return "Technology"; // Level 0 is Technology (root)
  } else if (level >= 1 && level <= 7) {
    return `How${level}`; // Level 1 = How1, Level 2 = How2, ..., Level 7 = How7
  } else {
    return "How7"; // Cap at How7 for levels beyond 7
  }
}

// ----- FAST optimized prompt -----
const makeFastPrompt = (theme: string) => `
    <TECHNOLOGY_SEED> = ${theme}
<CONTEXT> = None

あなたは <TECHNOLOGY_SEED> の技術専門家です。
技術シーズから「どのように実現するか」を掘り下げる Technology → How1 → How2 → How3+ の **FAST階層ツリー** を **JSON形式** で出力してください。
階層深さ・ノード数は技術的論理が尽きるまで可変とし、
「どの階層でも *すべて同数* になる固定パターンは禁止」です。

────────────────────────────────────
【 内部思考（ユーザー非公開）】

0-A　<TECHNOLOGY_SEED> の技術的本質を 5 語以内で要約し、核心技術要素を抽出。
0-B　技術シーズから **実現可能な技術応用分野** を重複なく列挙。
　　 ★技術起点で考える：この技術で何ができるか？どう発展させるか？
　　 ★最初は多めに洗い出し（7 件以上可）、重複・冗長を削りつつ 3〜7 件に整える。
0-C　各技術応用で再帰的技術ブレーンストーミング：
　　① How1：技術をどのように具体化するか → MECE に分割した実装方式（≥3 件、個数非固定）
　　② How2：各実装方式をどのように詳細化するか → 具体的技術手法・アルゴリズム（可変個数）  
　　③ How3：各技術手法をどのように細分化するか → 要素技術・コンポーネント（可変個数）
　　④ How4以降：「さらに技術的に分解できるか？」と自問し、可能な限り掘り下げ
0-D　全階層を再点検し MECE と "非固定数" と "技術的論理性" を確認し調整。

────────────────────────────────────
【 出力仕様 】
◆ ルートは **1 つの JSON オブジェクト**。
  "root" オブジェクト
  　• name: "Technology Seed: ${theme}" で始める。
  　• description: 技術シーズの概要（技術的特徴・可能性を含む）。
  　• children: 子ノード配列（以下同様の再帰構造）。
◆ 各ノードは
   { "name": string, "description": string, "children": [] }
   だけを含むこと。
◆ ルート name は必ず "Technology Seed: ${theme}" で始める。
◆ 末端ノードは children: []。

────────────────────────────────────
【 子ノード配列の各階層の定義 】
• ルート（Technology層）… <技術シーズ> 自体（技術の核心・本質）
• 第1階層（How1層）… 技術を「どのように実装するか」の方式
• 第2階層（How2層）… 実装方式を「どのように詳細化するか」の技術手法
• 第3階層（How3層）… 技術手法を「どのように構成するか」の要素技術
• 第4階層以降（How4+層）… 要素技術を必要なだけ技術的にネスト（深さ・個数可変）

────────────────────────────────────
【 重要な観点 】
• 技術起点思考：ニーズではなく技術シーズから発想
• 実装中心：「なぜ」ではなく「どのように」を重視
• 技術的実現性：各階層で具体的な技術的手段を明確化
• 発展可能性：技術の拡張・応用可能性を考慮

────────────────────────────────────
【 禁止事項 】
• 「主要技術」「補助技術」「〜という技術」等の冗長語
• 市場ニーズや用途中心の発想
• 抽象的すぎる表現（具体的技術名・手法名を使用）

────────────────────────────────────
【 MECE & 非固定数 & 技術論理性セルフチェック 】
□ 階層内で技術的役割・内容が重複していないか
□ 下位ノード総和で上位の技術を完全に説明できるか
□ *ノード数がそろい過ぎ* になっていないか
□ 各階層で技術的な「どのように」が明確か
□ 技術的実現可能性が保たれているか
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
            content:
              "You are a structured, concise technical assistant specialized in technology seed analysis.",
          },
          { role: "user", content: makeFastPrompt(searchTheme) },
        ],
      }),
    });
    if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
    const gpt = await oa.json();

    // Debug: Log the raw response
    console.log(
      "Raw OpenAI response (FAST):",
      JSON.stringify(gpt.choices[0].message.content, null, 2)
    );
    const parsedResponse = JSON.parse(gpt.choices[0].message.content);

    // Debug: Log the parsed response
    console.log(
      "Parsed response (FAST):",
      JSON.stringify(parsedResponse, null, 2)
    );

    // Handle both formats: direct tree structure or wrapped in root
    let treeRoot: BareNode;
    if (parsedResponse.root && parsedResponse.root.children) {
      // Standard format: { root: { name, description, children } }
      treeRoot = parsedResponse.root;
    } else if (parsedResponse.name && parsedResponse.children) {
      // Direct format: { name, description, children }
      treeRoot = parsedResponse;
    } else {
      console.error(
        "Invalid tree structure. Expected root.children or direct tree, got:",
        parsedResponse
      );
      throw new Error("Model returned malformed tree");
    }

    // Calculate maximum depth and generate dynamic layer_config
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
    // Generate layer config based on actual tree depth for FAST
    // Level 0 = Technology (root), Level 1 = How1, Level 2 = How2, etc.
    // Cap at How7 (level 7) as per database schema
    for (let i = 0; i <= Math.min(maxDepth, 7); i++) {
      dynamicLayerConfig.push(detectAxisFast(i)); // Level 0 = Technology, Level 1 = How1, etc.
    }

    /*──────── Supabase ────────*/
    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    // 1️⃣ technology_trees - Save root metadata with FAST mode indicator
    const { data: tt, error: ttErr } = await sb
      .from("technology_trees")
      .insert({
        name: treeRoot.name,
        description: treeRoot.description ?? "",
        search_theme: searchTheme,
        reasoning:
          parsedResponse.reasoning ??
          `Generated FAST technology tree for: ${searchTheme}`,
        layer_config: dynamicLayerConfig,
        scenario_inputs: parsedResponse.scenario_inputs ?? {
          what: null,
          who: null,
          where: null,
          when: null,
        },
        mode: "FAST", // Add mode indicator for FAST trees
      })
      .select("id")
      .single();
    if (ttErr) throw new Error(`DB error (tree): ${ttErr.message}`);

    // 2️⃣ Insert root node at level 0 - This IS the Technology level
    const rootNodeId = crypto.randomUUID();
    const { error: rootError } = await sb.from("tree_nodes").insert({
      id: rootNodeId,
      tree_id: tt.id,
      parent_id: null,
      name: treeRoot.name,
      description: treeRoot.description ?? "",
      axis: "Technology" as any, // Level 0 = Technology (root)
      level: 0,
      node_order: 0,
      children_count: treeRoot.children.length,
      // path will be automatically set by the database trigger
    });
    if (rootError)
      throw new Error(`DB error (root node): ${rootError.message}`);

    // 3️⃣ tree_nodes recursion - Start with How1 level as level 1
    const saveNode = async (
      node: BareNode,
      parent: string | null,
      lvl = 1, // Start at level 1 for How1 applications
      idx = 0
    ) => {
      const id = crypto.randomUUID();

      // Map levels to correct axis for FAST:
      // Level 0 → Technology (root), Level 1 → How1, Level 2 → How2, Level 3 → How3, etc.
      const axisForLevel = detectAxisFast(lvl); // lvl 1 maps to How1, lvl 2 maps to How2, etc.

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

    // Save How levels (children of Technology root) as level 1 nodes with Technology root as parent
    for (let i = 0; i < treeRoot.children.length; i++) {
      await saveNode(treeRoot.children[i], rootNodeId, 1, i);
    }

    return new Response(JSON.stringify({ success: true, treeId: tt.id }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge function error (FAST):", err);
    return new Response(JSON.stringify({ error: err.message ?? "unknown" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
