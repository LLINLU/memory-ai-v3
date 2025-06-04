import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface TreeNode {
  id: string;
  name: string;
  description: string;
  axis: "Scenario" | "Purpose" | "Function" | "Measure";
  children?: TreeNode[];
}

interface TreeStructure {
  root: TreeNode;
  reasoning: string;
  layer_config: string[];
  scenario_inputs: {
    what: null;
    who: null;
    where: null;
    when: null;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { searchTheme } = await req.json();

    if (!searchTheme) {
      return new Response(
        JSON.stringify({ error: "searchTheme is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({
          error:
            "OpenAI API key is not configured. Please set OPENAI_API_KEY in Supabase Edge Function settings.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Generating tree for theme: ${searchTheme}`);

    // Create OpenAI request to generate tree structure

    const prompt = `あなたは ${searchTheme} の専門家です。  
シナリオ → 目的 → 機能 → 技術 → 要素技術 という 5 階層以上のツリーを、  
**下記 JSON 仕様** で **コードブロック 1 つ** のみ出力してください。  
階層深さ・ノード数は論理が尽きるまで可変とし、  
「どの階層でも *すべて同数* になる固定パターンは禁止」です。

────────────────────────────────────
【 内部思考（ユーザー非公開）】

0-A　${searchTheme} を 5 語以内で要約し核心概念を抽出。  
0-B　概念から **活用シナリオ** を重複なく列挙。  
　　 ★最初は多めに洗い出し（7 件以上可）、重複・冗長を削りつつ 3〜7 件に整える。  
0-C　各シナリオで再帰的ブレーンストーミング：  
　　① 目的を 1 つに集約。  
　　② 目的を MECE に分割 → 機能を列挙（≥3 件、個数非固定）。  
　　③ 機能ごとに **中核技術 1 件** を決定し、  
　　　　必要な **補完技術 1 件以上・可変** を漏れなく列挙。  
　　④ 各技術を「さらに要素技術へ分解できるか？」と自問し、  
　　　　可能な限り掘り下げ（第 5 階層以降）。  
0-D　全階層を再点検し MECE と "非固定数" を確認し調整。

────────────────────────────────────
【 出力仕様（JSON フォーマット）】

1️⃣ ルートは **1 つの JSON オブジェクト**。トップレベルキーは必ず  
　  "root", "reasoning", "layer_config", "scenario_inputs" の 4 つ。

2️⃣ "root" オブジェクト  
　• id: 文字列。必ず "root"。  
　• name: "Search Theme: ${searchTheme}" で始める。  
　• description: ルート概要（英語か日本語いずれでも可）。  
　• axis: 文字列。ルートは **"Scenario"** とする。  
　• children: 子ノード配列（以下同様の再帰構造）。

3️⃣ **子ノード共通プロパティ**  
　• id  : "lev<階層番号>_<乱数16進4〜8桁>" など重複しない文字列。  
　• name: ノード名（日本語）＋半角括弧内に英語訳を推奨。  
　• description: ノードの説明（任意言語）。  
　• axis:  
　　  - 第 1 階層 … "Scenario"  
　　  - 第 2 階層 … "Purpose"  
　　  - 第 3 階層 … "Function"  
　　  - 第 4 階層以降 … "Measure"  
　• children: 子ノード配列（分解不能なら空配列 []）。

4️⃣ "reasoning"    : 空文字列 "" をセット（内部思考は開示しない）。  
   "layer_config" : 必ず ["Scenario","Purpose","Function","Measure"]。  
   "scenario_inputs":  
   {
     "what": null,
     "who": null,
     "where": null,
     "when": null
   }

（値はすべて null で固定）

5️⃣ **禁止事項**
　• 箇条書き記号（• ・ - – — 等）、矢印(← →)、
　• 「主技術」「補完技術」「という技術」等の冗長語、
　• コードブロック外の文章、箱線記号。

6️⃣ **MECE & 非固定数セルフチェック**
　□ 階層内で役割・内容が重複していないか
　□ 下位ノード総和で上位を完全に説明できるか
　□ どの階層も *ノード数がそろい過ぎ* になっていないか
（追加切り口を検討し、必要なら追加／削減）
　□ テーマ固有でない汎用部品が中核技術に混在していないか
□ 深掘り可能な技術を途中で打ち切っていないか

セルフチェック合格後、**JSON オブジェクト全体**を

\`\`\`json
{ ... }
\`\`\`

の 1 つのコードブロックだけで出力せよ。`;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const responseText = await openaiResponse.text();
      console.error("OpenAI API error response:", responseText);
      throw new Error(
        `OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText} - ${responseText}`
      );
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0].message.content;

    // Extract JSON from the response (assuming it's in a code block)
    const jsonMatch = generatedContent.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in OpenAI response");
    }

    const treeStructure: TreeStructure = JSON.parse(jsonMatch[1]);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const { data: treeRecord, error: treeError } = await supabase
      .from("technology_trees")
      .insert({
        name: treeStructure.root.name,
        description: treeStructure.root.description,
        search_theme: searchTheme,
        reasoning: treeStructure.reasoning,
        layer_config: treeStructure.layer_config,
        scenario_inputs: treeStructure.scenario_inputs,
      })
      .select("id")
      .single();

    if (treeError) {
      throw new Error(`Database error: ${treeError.message}`);
    }

    // Function to generate unique node IDs
    const generateUniqueNodeId = () => {
      return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Function to ensure all node IDs are unique
    const assignUniqueIds = (node: TreeNode): TreeNode => {
      const newNode = {
        ...node,
        id: generateUniqueNodeId(),
        children: node.children
          ? node.children.map((child) => assignUniqueIds(child))
          : [],
      };
      return newNode;
    };

    // Assign unique IDs to all nodes
    const treeWithUniqueIds = assignUniqueIds(treeStructure.root);

    // Recursive function to save nodes
    const saveNodeRecursively = async (
      node: TreeNode,
      parentId: string | null,
      level: number
    ) => {
      const { error: nodeError } = await supabase.from("tree_nodes").insert({
        id: node.id,
        tree_id: treeRecord.id,
        parent_id: parentId,
        name: node.name,
        description: node.description,
        axis: node.axis,
        level: level,
        children_count: node.children?.length || 0,
      });

      if (nodeError) {
        throw new Error(`Node save error: ${nodeError.message}`);
      }

      // Save children recursively
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          await saveNodeRecursively(node.children[i], node.id, level + 1);
        }
      }
    };

    // Save the root node and its children (use the tree with unique IDs)
    await saveNodeRecursively(treeWithUniqueIds, null, 0);

    return new Response(
      JSON.stringify({
        success: true,
        treeId: treeRecord.id,
        treeStructure: treeStructure,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
