// deno-lint-ignore-file no-explicit-any
import { serve }        from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ---------- domain types ----------
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
  scenario_inputs: { what: null; who: null; where: null; when: null };
}

// ---------- CORS ----------
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------- entry ----------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: cors });

  try {
    const { searchTheme } = await req.json();
    if (!searchTheme) {
      return new Response(JSON.stringify({ error: "searchTheme is required" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // env vars
    const OPENAI_API_KEY    = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL      = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Server mis-config" }),
        { status: 500, headers: cors });
    }

    // ----- original prompt, only code-block instructions removed -----
    const prompt = `
<SEARCH_THEME> ＝ ${searchTheme}
<CONTEXT>      ＝ None

あなたは <SEARCH_THEME> の専門家です。  
シナリオ → 目的 → 機能 → 技術という 4階層以上のツリーを、  
**コードブロック 1 つ**のみで出力してください。
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
【出力仕様】

 箱線書式（├── | │   | └── のみ使用） 
    - Root は <SEARCH_THEME>
    • 第1階層 … <検索テーマ> を活用した「〜というシナリオ」
    • 第2階層 … シナリオを達成する「〜という目的」  
    • 第3階層 … 目的を構成する「〜という機能」  
    • 第4階層 … 機能を実現する技術  
         - 1 行目＝中核技術（テーマ固有）  
         - 2 行目以降＝補完技術（≧1、数は可変。機能ごとに異なって良い）  
    • 第5階層以降 … 要素技術を必要なだけネスト  
      （深さ・個数は技術ごとに可変）

**禁止事項**
　• 箇条書き記号（• ・ - – — 等）、矢印(← →)、
　• 「主技術」「補完技術」「という技術」等の冗長語、
　• コードブロック外の文章、箱線記号。

 **MECE & 非固定数セルフチェック**
　□ 階層内で役割・内容が重複していないか
　□ 下位ノード総和で上位を完全に説明できるか
　□ どの階層も *ノード数がそろい過ぎ* になっていないか
（追加切り口を検討し、必要なら追加／削減）
　□ テーマ固有でない汎用部品が中核技術に混在していないか
□ 深掘り可能な技術を途中で打ち切っていないか


セルフチェック合格後、ツリーだけをコードブロックで出力。
`;

    // ----- OpenAI call with structured output -----
    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",                
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 4000,
      }),
    });

    if (!oaRes.ok) {
      const detail = await oaRes.text();
      throw new Error(`OpenAI error ${oaRes.status}: ${detail}`);
    }

    const data   = await oaRes.json();              
    const raw    = data.choices[0].message.content as string;
    // const tree   = JSON.parse(raw) as TreeStructure; 
    // ----- Parse tree from raw text ------
    type Node = {
      id: string;
      name: string;
      description: string;
      axis: string;
      children: Node[];
    };

    
    function generateId(level: number): string {
      return `lev${level}_${Math.random().toString(36).substring(2, 8)}`;
    }
    
    function detectAxis(level: number): string {
      const axisMap = ['Scenario', 'Purpose', 'Function', 'Measure'];
      if (level < axisMap.length) {
        return axisMap[level];
      } else {
        return `Measure${level - axisMap.length + 2}`; // e.g., level 4 => Measure2, 5 => Measure3
      }
    }

    
    function parseIndentedText(input: string): Node {
      const lines = input.split('\n').filter(line => line.trim());
      const root: Node = {
        id: 'root',
        name: lines[0].trim(), // First line as root name
        description: '',
        axis: 'Scenario',
        children: [],
      };
    
      const stack: { node: Node; indent: number }[] = [{ node: root, indent: -1 }];
    
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(.*?)([├└]──)(.*)$/);
        if (!match) continue;
    
        const leading = match[1];
        const name = match[3].trim();
        const indent = (leading.match(/[│　 ]/g) || []).length;
        const level = stack.length;
    
        const node: Node = {
          id: generateId(level),
          name: name,
          description: '',
          axis: detectAxis(level - 1),
          children: [],
        };
    
        while (stack.length && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
    
        const parent = stack[stack.length - 1];
        parent.node.children.push(node);
        stack.push({ node, indent });
      }
    
      return root;
    }
    // Custom parse
    const tree = {
      root: parseIndentedText(rawText),
      reasoning: "",
      layer_config: ["Scenario", "Purpose", "Function", "Measure"],
      scenario_inputs: {
        what: null,
        who: null,
        where: null,
        when: null,
      }
    };
    
    // ----- Supabase writes -----
    const supabase = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    const { data: treeRec, error: treeErr } = await supabase
      .from("technology_trees")
      .insert({
        name:            tree.root.name,
        description:     tree.root.description,
        search_theme:    searchTheme,
        reasoning:       tree.reasoning,
        layer_config:    tree.layer_config,
        scenario_inputs: tree.scenario_inputs,
      })
      .select("id")
      .single();
    if (treeErr) throw new Error(`DB error: ${treeErr.message}`);    // recursive insert helper
    const saveNode = async (node: TreeNode, parent: string | null, lvl = 0, idx = 0) => {
      // Always generate a new UUID for database storage to avoid conflicts
      const dbNodeId = crypto.randomUUID();
      
      const { error } = await supabase.from("tree_nodes").insert({
        id:             dbNodeId,
        tree_id:        treeRec.id,
        parent_id:      parent,
        name:           node.name,
        description:    node.description,
        axis:           node.axis,
        level:          lvl,
        node_order:     idx,
        children_count: node.children?.length ?? 0,
      });
      if (error) throw new Error(`DB node error: ${error.message}`);
      
      // Use the database node ID for children's parent_id
      for (let i = 0; i < (node.children ?? []).length; i++) {
        await saveNode(node.children[i], dbNodeId, lvl + 1, i);
      }
    };
    await saveNode(tree.root, null);

    return new Response(JSON.stringify({ success: true, treeId: treeRec.id, treeStructure: tree }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message ?? "unknown" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
