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
// STEP 2 INTERNAL PROCESSING FUNCTION (FAST)
// =============================================================================

interface Step2Params {
  searchTheme: string;
  implementationId: string;
  implementationName: string;
  implementationDescription: string;
  treeId: string;
  team_id: string | null;
  supabaseClient: any;
  openaiApiKey: string;
}

async function processStep2Internal(params: Step2Params): Promise<any> {
  const {
    searchTheme,
    implementationId,
    implementationName,
    implementationDescription,
    treeId,
    team_id,
    supabaseClient: sb,
    openaiApiKey,
  } = params;

  console.log(
    `=== STEP 2 INTERNAL (FAST): Generating subtree for implementation: ${implementationName} ===`
  );

  /*──────── OpenAI for Step 2 ────────*/
  const oa = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a structured, concise assistant specialized in detailed technology subtree generation using FAST methodology.",
        },
        {
          role: "user",
          content: makeStepTwoPrompt(
            searchTheme,
            implementationName,
            implementationDescription
          ),
        },
      ],
    }),
  });
  if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
  const gpt = await oa.json();
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(gpt.choices[0].message.content);
  } catch (parseError) {
    console.error(
      `[STEP 2 INTERNAL FAST] Failed to parse OpenAI response:`,
      parseError
    );
    throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
  }

  // Handle children array format (no application wrapper needed)
  let implementationNodes: BareNode[];
  if (parsedResponse.children && Array.isArray(parsedResponse.children)) {
    implementationNodes = parsedResponse.children;
  } else if (parsedResponse.subtree && parsedResponse.subtree.children) {
    // Fallback: if model still returns subtree format, extract children
    implementationNodes = parsedResponse.subtree.children;
    console.log(
      `[STEP 2 INTERNAL FAST] Using subtree.children, found ${implementationNodes.length} implementation nodes`
    );
  } else if (parsedResponse.name && parsedResponse.children) {
    // Fallback: if model returns application node, extract children
    implementationNodes = parsedResponse.children;
    console.log(
      `[STEP 2 INTERNAL FAST] Using application.children, found ${implementationNodes.length} implementation nodes`
    );
  } else {
    console.error(
      `[STEP 2 INTERNAL FAST] Invalid subtree structure for ${implementationName}. Available keys:`,
      Object.keys(parsedResponse)
    );
    console.error(`[STEP 2 INTERNAL FAST] Full response:`, parsedResponse);
    throw new Error("Model returned malformed subtree");
  }

  /*──────── Python API Enrichment ────────*/
  console.log(`=== Calling Python API for enrichment: ${implementationName} ===`);

  // Prepare subtree data for Python API
  const subtreeWithIds = assignIdsToSubtree(implementationNodes);

  const implementationTreeInput = {
    treeId,
    scenarioNode: {
      id: implementationId,
      title: implementationName,
      description: implementationDescription,
      level: 1,
      children: subtreeWithIds,
    },
  };

  // Call Python API for enrichment (mock for now)
  console.log(`[STEP 2 INTERNAL FAST] Calling enrichment API...`);
  const enrichedResponse = await callPythonEnrichmentAPI(implementationTreeInput);
  console.log(`=== Enrichment completed for: ${implementationName} ===`);

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
    const axisForLevel = detectAxisFast(lvl);

    console.log(`[SAVE] Saving node at level ${lvl}:`, {
      id,
      name: bareNode.name,
      parentId,
      axis: axisForLevel,
      level: lvl,
      order: idx,
      childrenCount: bareNode.children.length,
    });

    // Validate axis value exists in enum for FAST
    const validAxisValues = [
      "Technology",
      "How1", //level 1
      "How2", //level 2
      "How3", //level 3
      "How4",
      "How5",
      "How6",
      "How7",
    ];

    if (!validAxisValues.includes(axisForLevel)) {
      console.error(
        `[SAVE] Invalid axis value: ${axisForLevel} for level ${lvl}`
      );
      throw new Error(`Invalid axis value: ${axisForLevel} for level ${lvl}`);
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
        throw new Error(`DB error (node ${id}): ${error.message}`);
      }

      console.log(`[SAVE] Successfully saved node ${id} at level ${lvl}`);
    } catch (dbError) {
      console.error(`[SAVE] Failed to save node ${id}:`, dbError);
      throw dbError;
    }

    // Save enriched data for this node (papers and use cases)
    try {
      if (enrichedNode.papers && enrichedNode.papers.length > 0) {
        await saveNodePapers(sb, id, treeId, enrichedNode.papers, team_id);
      }
      if (enrichedNode.useCases && enrichedNode.useCases.length > 0) {
        await saveNodeUseCases(sb, id, treeId, enrichedNode.useCases, team_id);
      }
    } catch (enrichError) {
      console.error(
        `[SAVE] Failed to save enriched data for node ${id}:`,
        enrichError
      );
    }

    // Recursively save children
    console.log(
      `[SAVE] Processing ${bareNode.children.length} children for node ${id}`
    );
    for (let i = 0; i < bareNode.children.length; i++) {
      const correspondingEnrichedChild = enrichedNode.children?.[i];
      if (correspondingEnrichedChild) {
        await saveSubtreeWithEnrichment(
          bareNode.children[i],
          correspondingEnrichedChild,
          id,
          lvl + 1,
          i
        );
      } else {
        console.warn(
          `[SAVE] No enriched data found for child ${i} of node ${id}`
        );
      }
    }

    console.log(`[SAVE] Completed saving node ${id} and all its children`);
  };

  // Save enriched data for the implementation node itself
  try {
    if (
      enrichedResponse.scenarioNode.papers &&
      enrichedResponse.scenarioNode.papers.length > 0
    ) {
      await saveNodePapers(
        sb,
        implementationId,
        treeId,
        enrichedResponse.scenarioNode.papers,
        team_id
      );
    }
    if (
      enrichedResponse.scenarioNode.useCases &&
      enrichedResponse.scenarioNode.useCases.length > 0
    ) {
      await saveNodeUseCases(
        sb,
        implementationId,
        treeId,
        enrichedResponse.scenarioNode.useCases,
        team_id
      );
    }
  } catch (implementationEnrichError) {
    console.error(
      `[STEP 2 INTERNAL FAST] Failed to save enriched data for implementation node ${implementationId}:`,
      implementationEnrichError
    );
  }

  // Save implementation nodes (level 2) and their subtrees
  for (let i = 0; i < implementationNodes.length; i++) {
    const correspondingEnrichedNode =
      enrichedResponse.scenarioNode.children?.[i];
    if (correspondingEnrichedNode) {
      await saveSubtreeWithEnrichment(
        implementationNodes[i],
        correspondingEnrichedNode,
        implementationId,
        2, // How2 level
        i
      );
    } else {
      console.warn(
        `[STEP 2 INTERNAL FAST] No enriched data found for implementation node ${i} of implementation ${implementationId}`
      );
    }
  }

  // IMPORTANT: Update implementation node children_count ONLY AFTER all subtree nodes are completely saved
  // This prevents the frontend polling from triggering too early when only partial data is available
  const { error: updateError } = await sb
    .from("tree_nodes")
    .update({ children_count: implementationNodes.length })
    .eq("id", implementationId);

  if (updateError) {
    console.error(
      `[STEP 2 INTERNAL FAST] Failed to update children_count for implementation ${implementationId}:`,
      updateError
    );
  }

  console.log(
    `[STEP 2 INTERNAL FAST] Successfully completed subtree generation for implementation: ${implementationName}`
  );

  return {
    success: true,
    implementationId,
    implementationName,
    implementationNodesCount: implementationNodes.length,
    enrichedDataSaved: true,
  };
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
  implementationTree: ScenarioTreeInput
): Promise<EnrichedScenarioResponse> {
  console.log(`[MOCK API] Implementation: ${implementationTree.scenarioNode.title}`);

  const enrichedNode = enrichNodeWithMockData(implementationTree.scenarioNode);

  return {
    treeId: implementationTree.treeId,
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
      title: `${nodeTitle}: Technical Implementation Paper ${i + 1}`,
      authors: generateMockAuthors(),
      journal: generateMockJournal(),
      tags: generateMockTags(nodeTitle),
      abstract: `This paper explores technical implementation approaches for ${nodeTitle.toLowerCase()}. The research demonstrates innovative methodologies and practical solutions for real-world deployment.`,
      date: generateRandomDate(),
      citations: Math.floor(Math.random() * 200) + 10,
      region: Math.random() > 0.5 ? "international" : "domestic",
      doi: `10.1000/fast.${paperId.split("-")[0]}`,
      url: `https://example.com/fast-paper/${paperId}`,
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
        title: `${nodeTitle} Technical Deployment ${j + 1}`,
        url: `https://example.com/fast-press-release/${useCaseId}-${j}`,
        date: generateRandomDate(),
      });
    }

    useCases.push({
      id: useCaseId,
      title: `${nodeTitle} Technical Application ${i + 1}`,
      description: `Technical implementation of ${nodeTitle.toLowerCase()} demonstrating practical application and measurable performance improvements.`,
      releases,
      pressReleases,
    });
  }

  return useCases;
}

function generateMockAuthors(): string {
  const firstNames = ["Alex", "Blake", "Casey", "Drew", "Elliot", "Finley"];
  const lastNames = [
    "Chen",
    "Kumar",
    "Martinez",
    "Anderson",
    "Thompson",
    "Davis",
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
    "IEEE Transactions on Technology Implementation",
    "ACM Computing Applications",
    "Nature Technology Methods",
    "Journal of Applied Engineering",
    "Technical Implementation Review",
  ];

  return journals[Math.floor(Math.random() * journals.length)];
}

function generateMockTags(nodeTitle: string): string[] {
  const baseTags = ["implementation", "technical", "engineering"];
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
  return nodes.map((node, index) => {
    const id = crypto.randomUUID();

    const result = {
      id,
      title: node.name,
      description: node.description || "",
      level: startLevel,
      children: assignIdsToSubtree(node.children, startLevel + 1),
    };
    return result;
  });
}

// ---------- domain types ----------
interface BareNode {
  name: string;
  description?: string;
  children: BareNode[];
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

// ----- Step 1: Generate Root + How1 only -----
const makeStepOnePrompt = (theme: string) => `
<TECHNOLOGY_SEED> = ${theme}
<CONTEXT> = None

あなたは <TECHNOLOGY_SEED> の技術専門家です。
**第1段階**: 技術ルート（Technology）と第1階層（How1 - 実装方式）のみを生成してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【内部思考（ユーザー非公開）】

0-A　<TECHNOLOGY_SEED> の技術的本質を 5 語以内で要約し、核心技術要素を抽出。
0-B　技術シーズを **どのように実装するか** の方式を重複なく列挙。
　　 ★技術起点で考える：この技術をどう実現するか？どう実装するか？
　　 ★最初は多めに洗い出し（7 件以上可）、重複・冗長を削りつつ 3〜7 件に整える。
0-C　各実装方式の概要説明を簡潔に記述（詳細は第2段階で展開）。
0-D　実装方式間でMECE（重複なし・漏れなし）を確認し調整。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【出力仕様】
◆ ルートは **1 つの JSON オブジェクト**。
  "root" オブジェクト
  　• name: "Technology Seed: ${theme}" で始める。
  　• description: 技術シーズの概要（技術的特徴・可能性を含む）。
  　• children: 実装方式配列（第1階層のみ）。
◆ 各実装方式ノードは
   { "name": string, "description": string, "children": [] }
◆ ルート name は必ず "Technology Seed: ${theme}" で始める。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第1階層の定義】
• How1層（実装方式）… 技術を「どのように実装するか」の方式
　例: "機械学習ベース実装"、"ルールベース実装"、"ハイブリッド実装"など

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【禁止事項】
• 汎用的すぎる実装方式は避ける（技術固有にする）
• 市場ニーズや用途中心の発想（技術起点を維持）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【MECEセルフチェック】
□ 実装方式間で役割・内容が重複していないか
□ 実装方式総和で技術の主要実現手法を網羅しているか

セルフチェック合格後、JSON を出力してください。
`;

// ----- Step 2: Generate subtree for a specific implementation method -----
const makeStepTwoPrompt = (
  theme: string,
  implementationName: string,
  implementationDescription: string
) => `
<TECHNOLOGY_SEED> = ${theme}
<IMPLEMENTATION_METHOD> = ${implementationName}
<IMPLEMENTATION_DESCRIPTION> = ${implementationDescription}
<CONTEXT> = None

あなたは <TECHNOLOGY_SEED> の技術専門家です。
**第2段階**: 特定の実装方式「${implementationName}」の詳細なサブツリーを生成してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【内部思考（ユーザー非公開）】

0-A　<IMPLEMENTATION_METHOD> を実現するための技術手法を MECE に分割。
0-B　各技術手法ごとに必要な要素技術を列挙（≥3 件、個数非固定）。
0-C　要素技術ごとに **コア技術 1 件** を決定し、
　　　必要な **サポート技術 1 件以上・可変** を漏れなく列挙。
0-D　各技術を「さらに要素技術へ分解できるか？」と自問し、
　　　可能な限り掘り下げ（第 5 階層以降）。
0-E　全階層を再点検し MECE と "非固定数" を確認し調整。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【出力仕様】
◆ トップレベルは **技術手法ノード配列**。
  "children" 配列
  　• 実装方式の子ノード（技術手法配列）を直接出力。
  　• 実装方式ノード自体は含めない（既に保存済み）。
◆ 各ノードは
   { "name": string, "description": string, "children": [] }
   だけを含むこと。
◆ 末端ノードは children: []。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【各階層の定義】
• 第1階層（How2層）… 実装方式を「どのように詳細化するか」の技術手法
• 第2階層（How3層）… 技術手法を「どのように構成するか」の要素技術
• 第3階層以降（How4+層）… 要素技術を必要なだけ技術的にネスト（深さ・個数可変）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【禁止事項】
• 「主技術」「補助技術」「という技術」等の冗長語
• 技術シーズ固有でない汎用部品がコア技術に混在
• 市場ニーズや用途中心の発想

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【MECE & 非固定数セルフチェック】
□ 階層内で役割・内容が重複していないか
□ 下位ノード総和で上位を完全に説明できるか
□ *ノード数がそろい過ぎ* になっていないか
□ 技術シーズ固有でない汎用部品がコア技術に混在していないか
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
    console.log(`[MAIN FAST-V2] Received request:`, {
      method: req.method,
      hasSearchTheme: !!requestBody.searchTheme,
      hasTeamId: !!requestBody.team_id,
    });

    const { searchTheme, team_id } = requestBody;

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
    console.log("=== GENERATING COMPLETE FAST TECHNOLOGY TREE V2 ===");

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
              "You are a structured, concise assistant specialized in FAST technology tree generation.",
          },
          { role: "user", content: makeStepOnePrompt(searchTheme) },
        ],
      }),
    });
    if (!oa.ok) throw new Error(`OpenAI ${oa.status}: ${await oa.text()}`);
    const gpt = await oa.json();

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

    // 🔒 PROGRAMMATICALLY ENSURE IMPLEMENTATION CHILDREN ARE EMPTY
    // This guarantees no misalignment regardless of AI output
    if (treeRoot.children) {
      treeRoot.children.forEach((implementation) => {
        implementation.children = []; // Force empty children for all implementations
      });
    }

    // Generate basic layer config for FAST approach
    const dynamicLayerConfig = ["Technology", "How1", "How2", "How3", "How4"];

    /*──────── Supabase Step 1 ────────*/
    // 1️⃣ technology_trees - Save root metadata
    const { data: tt, error: ttErr } = await sb
      .from("technology_trees")
      .insert({
        name: treeRoot.name,
        description: treeRoot.description ?? "",
        search_theme: searchTheme,
        reasoning:
          parsedResponse.reasoning ?? `Generated FAST tree for: ${searchTheme}`,
        layer_config: dynamicLayerConfig,
        scenario_inputs: parsedResponse.scenario_inputs ?? {
          what: null,
          who: null,
          where: null,
          when: null,
        },
        mode: "FAST", // FAST mode indicator
        team_id: team_id || null,
      })
      .select("id")
      .single();
    if (ttErr) throw new Error(`DB error (tree): ${ttErr.message}`);

    // 2️⃣ Insert root node at level 0 (Technology level)
    const rootNodeId = crypto.randomUUID();
    const { error: rootError } = await sb.from("tree_nodes").insert({
      id: rootNodeId,
      tree_id: tt.id,
      parent_id: null,
      name: treeRoot.name,
      description: treeRoot.description ?? "",
      axis: "Technology" as any,
      level: 0,
      node_order: 0,
      children_count: treeRoot.children.length,
      team_id: team_id || null,
    });
    if (rootError)
      throw new Error(`DB error (root node): ${rootError.message}`);

    // 3️⃣ Insert implementation nodes (level 1 = How1) with children_count = 0 (indicating pending generation)
    const implementationPromises = treeRoot.children.map(async (implementation, idx) => {
      const implementationId = crypto.randomUUID();
      const { error } = await sb.from("tree_nodes").insert({
        id: implementationId,
        tree_id: tt.id,
        parent_id: rootNodeId,
        name: implementation.name,
        description: implementation.description ?? "",
        axis: "How1" as any,
        level: 1,
        node_order: idx,
        children_count: 0, // Important: Set to 0 to indicate subtree not generated yet
        team_id: team_id || null,
      });
      if (error) throw new Error(`DB error (implementation node): ${error.message}`);
      return {
        id: implementationId,
        name: implementation.name,
        description: implementation.description,
      };
    });
    const implementations = await Promise.all(implementationPromises);

    console.log(
      `[STEP 1 FAST] Created ${implementations.length} implementations, starting Step 2 generation`
    );

    // Start Step 2 generation for each implementation asynchronously with proper error handling
    const step2Promises = implementations.map(async (implementation) => {
      try {
        console.log(
          `[STEP 1 FAST] Starting Step 2 for implementation: ${implementation.name} (ID: ${implementation.id})`
        );

        // Call Step 2 logic directly (not via HTTP) to avoid recursive endpoint calls
        const step2Result = await processStep2Internal({
          searchTheme,
          implementationId: implementation.id,
          implementationName: implementation.name,
          implementationDescription: implementation.description || "",
          treeId: tt.id,
          team_id,
          supabaseClient: sb,
          openaiApiKey: OPENAI_API_KEY,
        });

        console.log(
          `[STEP 1 FAST] Step 2 completed for implementation: ${implementation.name}`,
          step2Result
        );
        return {
          implementation: implementation.name,
          success: true,
          result: step2Result,
        };
      } catch (error) {
        console.error(
          `[STEP 1 FAST] Error in Step 2 for implementation ${implementation.name}:`,
          {
            message: error.message,
            stack: error.stack,
          }
        );
        return {
          implementation: implementation.name,
          success: false,
          error: error.message,
        };
      }
    });

    console.log(
      `[STEP 1 FAST] Starting ${implementations.length} Step 2 processes in background...`
    );

    // Use a completely detached approach - no promise chains that could block function termination
    const backgroundProcessor = async () => {
      try {
        const results = await Promise.allSettled(step2Promises);
        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;
        console.log(
          `[COMPLETE FAST] All Step 2 processes completed: ${successful} successful, ${failed} failed`
        );

        if (failed > 0) {
          const failedResults = results
            .filter((r) => r.status === "rejected")
            .map((r, i) => ({
              implementation: implementations[i]?.name || "Unknown",
              error: r.reason?.message || r.reason,
            }));
          console.error(`[COMPLETE FAST] Failed implementations:`, failedResults);
        }
      } catch (error) {
        console.error(
          `[COMPLETE FAST] Error in background Step 2 processing:`,
          error
        );
      }
    };

    // Execute background processing without any awaiting or promise chaining
    backgroundProcessor(); // Fire and forget

    // Return immediately so implementations appear in UI with generating indicators
    return new Response(
      JSON.stringify({
        success: true,
        treeId: tt.id,
        message:
          "FAST tree generation started. Implementations created, subtrees generating in background.",
        implementations: implementations.map((i) => ({ id: i.id, name: i.name })),
        status: "generating", // Indicates background processing is active
      }),
      {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("=== EDGE FUNCTION ERROR (FAST v2) ===");
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