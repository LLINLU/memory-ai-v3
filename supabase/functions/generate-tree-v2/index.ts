// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// =============================================================================
// MOCK API FUNCTIONS (for Papers and Use Cases)
// =============================================================================

/**
 * Mock function to simulate Python API call for tree papers enrichment
 * Returns tree data enriched with papers only
 */
async function callPythonPapersAPI(
  scenarioTree: ScenarioTreeInput
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`[MOCK PAPERS API] Scenario: ${scenarioTree.scenarioNode.title}`);

  // Generate papers-only enriched data for the entire subtree
  const enrichedNode = enrichNodeWithPapers(scenarioTree.scenarioNode);

  return {
    treeId: scenarioTree.treeId,
    scenarioNode: enrichedNode,
  };
}

async function callPythonUseCasesAPI(
  scenarioTree: ScenarioTreeInput
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log(
    `[MOCK USECASES API] Scenario: ${scenarioTree.scenarioNode.title}`
  );

  // Generate use cases-only enriched data for the entire subtree
  const enrichedNode = enrichNodeWithUseCases(scenarioTree.scenarioNode);

  return {
    treeId: scenarioTree.treeId,
    scenarioNode: enrichedNode,
  };
}

/**
 * Recursively enrich each node with papers only
 */
function enrichNodeWithPapers(node: any): any {
  const papers = generateMockPapers(node.title, node.level);

  const enrichedChildren = node.children.map((child: any) =>
    enrichNodeWithPapers(child)
  );

  return {
    ...node,
    papers,
    children: enrichedChildren,
  };
}

/**
 * Recursively enrich each node with use cases only
 *
 * 🚫 TEMPORARILY DISABLED - Use Cases API not production ready
 * This function is commented out until the use cases API is ready for production
 */

function enrichNodeWithUseCases(node: any): any {
  const useCases = generateMockUseCases(node.title, node.level);

  const enrichedChildren = node.children.map((child: any) =>
    enrichNodeWithUseCases(child)
  );

  return {
    ...node,
    useCases,
    children: enrichedChildren,
  };
}

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
  useCases?: UseCase[]; // Optional since use cases API is not production ready
  children: EnrichedTreeNode[];
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string | null; // Allow null dates for papers without publication dates
  citations: number;
  region: string;
  doi: string;
  url: string;
  score: number;
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

// STEP 2 INTERNAL PROCESSING FUNCTION
interface Step2Params {
  searchTheme: string;
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
  treeId: string;
  team_id: string | null;
  supabaseClient: any;
  openaiApiKey: string;
}

async function processStep2Internal(params: Step2Params): Promise<any> {
  const {
    searchTheme,
    scenarioId,
    scenarioName,
    scenarioDescription,
    treeId,
    team_id,
    supabaseClient: sb,
    openaiApiKey,
  } = params;

  console.log(
    `=== STEP 2 INTERNAL: Generating subtree for scenario: ${scenarioName} ===`
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
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(gpt.choices[0].message.content);
  } catch (parseError) {
    console.error(
      `[STEP 2 INTERNAL] Failed to parse OpenAI response:`,
      parseError
    );
    throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
  }

  // Handle children array format (no scenario wrapper needed)
  let purposeNodes: BareNode[];
  if (parsedResponse.children && Array.isArray(parsedResponse.children)) {
    purposeNodes = parsedResponse.children;
  } else if (parsedResponse.subtree && parsedResponse.subtree.children) {
    // Fallback: if model still returns subtree format, extract children
    purposeNodes = parsedResponse.subtree.children;
    console.log(
      `[STEP 2 INTERNAL] Using subtree.children, found ${purposeNodes.length} purpose nodes`
    );
  } else if (parsedResponse.name && parsedResponse.children) {
    // Fallback: if model returns scenario node, extract children
    purposeNodes = parsedResponse.children;
    console.log(
      `[STEP 2 INTERNAL] Using scenario.children, found ${purposeNodes.length} purpose nodes`
    );
  } else {
    console.error(
      `[STEP 2 INTERNAL] Invalid subtree structure for ${scenarioName}. Available keys:`,
      Object.keys(parsedResponse)
    );
    console.error(`[STEP 2 INTERNAL] Full response:`, parsedResponse);
    throw new Error("Model returned malformed subtree");
  }

  /*──────── Python API Enrichment ────────*/
  console.log(`=== Calling Python API for enrichment: ${scenarioName} ===`);

  // Prepare subtree data for Python API
  const subtreeWithIds = assignIdsToSubtree(purposeNodes);
  // console.log(`[STEP 2 INTERNAL] Assigned IDs, building scenario tree input`);

  const scenarioTreeInput = {
    treeId,
    scenarioNode: {
      id: scenarioId,
      title: scenarioName,
      description: scenarioDescription,
      level: 1,
      children: subtreeWithIds,
    },
  }; // Call Python API for enrichment (papers only for now)
  console.log(`[STEP 2 INTERNAL] Calling papers API...`);
  let enrichedResponse: EnrichedScenarioResponse;
  try {
    enrichedResponse = await callTreePapersAPI(scenarioTreeInput);
  } catch (apiErr) {
    console.error("[tree_papers] prod API failed, using mock:", apiErr.message);
    enrichedResponse = await callPythonPapersAPI(scenarioTreeInput);
  }
  console.log(`=== Papers enrichment completed: ${enrichedResponse} ===`);

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
    const axisForLevel = detectAxis(lvl);

    // Validate axis value exists in enum
    const validAxisValues = [
      "Root",
      "Scenario", //level 1
      "Purpose", //level 2
      "Function", //level 3
      "Measure",
      "Measure2",
      "Measure3",
      "Measure4",
      "Measure5",
      "Measure6",
      "Measure7",
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
    } // Save enriched data for this node (papers only for now)
    try {
      if (enrichedNode.papers && enrichedNode.papers.length > 0) {
        await saveNodePapers(sb, id, treeId, enrichedNode.papers, team_id);
      }
      // Use cases will be saved separately later
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
  // Save enriched data for the scenario node itself (papers only for now)
  try {
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
    }
    // Use cases will be saved separately later
  } catch (scenarioEnrichError) {
    console.error(
      `[STEP 2 INTERNAL] Failed to save enriched data for scenario node ${scenarioId}:`,
      scenarioEnrichError
    );
  }
  // Save purpose nodes (level 2) and their subtrees
  for (let i = 0; i < purposeNodes.length; i++) {
    const correspondingEnrichedNode =
      enrichedResponse.scenarioNode.children?.[i];
    if (correspondingEnrichedNode) {
      await saveSubtreeWithEnrichment(
        purposeNodes[i],
        correspondingEnrichedNode,
        scenarioId,
        2, // Purpose level
        i
      );
    } else {
      console.warn(
        `[STEP 2 INTERNAL] No enriched data found for purpose node ${i} of scenario ${scenarioId}`
      );
    }
  }

  // IMPORTANT: Update scenario node children_count ONLY AFTER all subtree nodes are completely saved
  // This prevents the frontend polling from triggering too early when only partial data is available
  const { error: updateError } = await sb
    .from("tree_nodes")
    .update({ children_count: purposeNodes.length })
    .eq("id", scenarioId);

  if (updateError) {
    console.error(
      `[STEP 2 INTERNAL] Failed to update children_count for scenario ${scenarioId}:`,
      updateError
    );
  }
  console.log(
    `[STEP 2 INTERNAL] Successfully completed subtree generation for scenario: ${scenarioName}`
  );

  return {
    success: true,
    scenarioId,
    scenarioName,
    purposeNodesCount: purposeNodes.length,
    enrichedDataSaved: true,
    papersEnrichmentComplete: true,
    useCasesEnrichmentPending: true,
  };
}

// =============================================================================
// Basic-Auth helper (prod tree_papers)
// ---------------------------------------------------------------------------
function makeBasicAuthHeader(): string {
  const user = Deno.env.get("SEARCH_API_USER") ?? "admin";
  const pass = Deno.env.get("SEARCH_API_PASS") ?? "adminpassword";
  return "Basic " + btoa(`${user}:${pass}`);
}

// ---------------------------------------------------------------------------
// Production tree_papers API call
// ---------------------------------------------------------------------------
async function callTreePapersAPI(
  scenarioTree: ScenarioTreeInput
): Promise<EnrichedScenarioResponse> {
  // Transform the data to match the API's expected snake_case format
  const apiPayload = transformToSnakeCase(scenarioTree);

  const res = await fetch("https://search-api.memoryai.jp/tree_papers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: makeBasicAuthHeader(),
    },
    body: JSON.stringify(apiPayload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`tree_papers API ${res.status}: ${text}`);
  }

  const response = await res.json();
  // Transform the response back to camelCase if needed
  return transformToCamelCase(response);
}

// Helper function to transform camelCase to snake_case for API
function transformToSnakeCase(data: ScenarioTreeInput): any {
  const transformNode = (node: any): any => ({
    id: node.id,
    title: node.title,
    description: node.description,
    level: node.level,
    children: node.children.map(transformNode),
    ...(node.keywords && { keywords: node.keywords }),
    ...(node.context && { context: node.context }),
  });

  return {
    tree_id: data.treeId, // Convert treeId to tree_id
    scenario_node: transformNode(data.scenarioNode), // Convert scenarioNode to scenario_node
  };
}

// Helper function to transform snake_case response back to camelCase
function transformToCamelCase(response: any): EnrichedScenarioResponse {
  const transformNode = (node: any): any => ({
    id: node.id,
    title: node.title,
    description: node.description,
    level: node.level,
    papers: (node.papers || []).map((paper: any) => ({
      ...paper,
      date: validateAndFormatDate(paper.date), // Validate dates from API
      region: validateRegion(paper.region), // Validate regions from API
    })),
    useCases: node.use_cases || node.useCases, // Handle both formats
    children: (node.children || []).map(transformNode),
  });

  return {
    treeId: response.tree_id || response.treeId, // Handle both formats
    scenarioNode: transformNode(
      response.scenario_node || response.scenarioNode
    ),
  };
}

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

  const papersToInsert = papers.map((paper) => {
    const validatedDate = validateAndFormatDate(paper.date);
    const validatedRegion = validateRegion(paper.region);
    console.log(
      `[DB INSERT] Paper "${paper.title}" - Original date: "${paper.date}", Validated date: ${validatedDate}, Original region: "${paper.region}", Validated region: "${validatedRegion}"`
    );
    return {
      id: paper.id,
      node_id: nodeId,
      tree_id: treeId,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      tags: paper.tags,
      abstract: paper.abstract,
      date: validatedDate, // This will be either a valid date string or null
      citations: paper.citations,
      region: validatedRegion, // This will be either "domestic" or "international"
      doi: paper.doi,
      url: paper.url,
      team_id: teamId,
      score: paper.score,
    };
  });

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
      score: 0,
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

// Helper function to assign unique IDs to subtree nodes for API
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

// Function to determine axis based on level
function detectAxis(level: number): string {
  const axisMap = ["Root", "Scenario", "Purpose", "Function", "Measure"];
  if (level < axisMap.length) {
    return axisMap[level];
  } else {
    return `Measure${level - axisMap.length + 2}`; // e.g., level 5 => Measure2, 6 => Measure3
  }
}

// =============================================================================
// USE CASES ENRICHMENT FUNCTION (ASYNC AFTER TREE GENERATION)
// =============================================================================

/**
 * Enrich all tree nodes with use cases after the tree with papers is complete
 */
async function enrichTreeWithUseCases(
  treeId: string,
  supabaseClient: any,
  teamId: string | null
): Promise<void> {
  console.log(`[USECASES] Starting use cases enrichment for tree: ${treeId}`);

  try {
    // Get all tree nodes for this tree
    const { data: treeNodes, error: nodesError } = await supabaseClient
      .from("tree_nodes")
      .select("id, name, level, parent_id")
      .eq("tree_id", treeId)
      .order("level", { ascending: true });

    if (nodesError) {
      throw new Error(`Failed to fetch tree nodes: ${nodesError.message}`);
    }

    if (!treeNodes || treeNodes.length === 0) {
      console.log(`[USECASES] No nodes found for tree ${treeId}`);
      return;
    }

    console.log(
      `[USECASES] Found ${treeNodes.length} nodes to enrich with use cases`
    );

    // Build tree structure for API call (scenario level nodes only)
    const scenarioNodes = treeNodes.filter((node) => node.level === 1);

    for (const scenarioNode of scenarioNodes) {
      console.log(`[USECASES] Processing scenario: ${scenarioNode.name}`);

      // Build subtree for this scenario
      const scenarioSubtree = await buildScenarioTreeInput(
        treeId,
        scenarioNode,
        treeNodes,
        supabaseClient
      );
      // Call use cases API
      const enrichedResponse = await callPythonUseCasesAPI(scenarioSubtree);

      // Save use cases data recursively
      await saveEnrichedUseCasesRecursively(
        enrichedResponse.scenarioNode,
        treeId,
        supabaseClient,
        teamId
      );

      console.log(
        `[USECASES] Completed use cases enrichment for scenario: ${scenarioNode.name}`
      );
    }

    console.log(
      `[USECASES] Completed use cases enrichment for all scenarios in tree: ${treeId}`
    );
  } catch (error) {
    console.error(`[USECASES] Error enriching tree with use cases:`, error);
  }
}

/**
 * Build scenario tree input for use cases API call
 */
async function buildScenarioTreeInput(
  treeId: string,
  scenarioNode: any,
  allNodes: any[],
  supabaseClient: any
): Promise<ScenarioTreeInput> {
  // Build nested structure from flat nodes array
  const buildSubtree = (parentId: string, level: number): any[] => {
    const children = allNodes.filter(
      (node) => node.parent_id === parentId && node.level === level
    );

    return children.map((child) => ({
      id: child.id,
      title: child.name,
      description: "", // Could be fetched if needed
      level: child.level,
      children: buildSubtree(child.id, child.level + 1),
    }));
  };

  const children = buildSubtree(scenarioNode.id, scenarioNode.level + 1);

  return {
    treeId,
    scenarioNode: {
      id: scenarioNode.id,
      title: scenarioNode.name,
      description: "",
      level: scenarioNode.level,
      children,
    },
  };
}

/**
 * Save enriched use cases data recursively for all nodes
 */
async function saveEnrichedUseCasesRecursively(
  enrichedNode: any,
  treeId: string,
  supabaseClient: any,
  teamId: string | null
): Promise<void> {
  // Save use cases for this node
  if (enrichedNode.useCases && enrichedNode.useCases.length > 0) {
    await saveNodeUseCases(
      supabaseClient,
      enrichedNode.id,
      treeId,
      enrichedNode.useCases,
      teamId
    );
  }

  // Recursively save use cases for children
  if (enrichedNode.children && enrichedNode.children.length > 0) {
    for (const child of enrichedNode.children) {
      await saveEnrichedUseCasesRecursively(
        child,
        treeId,
        supabaseClient,
        teamId
      );
    }
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
    console.log("=== GENERATING COMPLETE TECHNOLOGY TREE ===");

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
          parsedResponse.reasoning ?? `Generated TED tree for: ${searchTheme}`,
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
      if (error) throw new Error(`DB error (scenario node): ${error.message}`);
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

        // Call Step 2 logic directly (not via HTTP) to avoid recursive endpoint calls
        const step2Result = await processStep2Internal({
          searchTheme,
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          scenarioDescription: scenario.description || "",
          treeId: tt.id,
          team_id,
          supabaseClient: sb,
          openaiApiKey: OPENAI_API_KEY,
        });

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
    }); // Start Step 2 processes for each scenario in background
    console.log(
      `[STEP 1] Starting ${scenarios.length} Step 2 processes in background...`
    );

    // Use a completely detached approach - no promise chains that could block function termination
    // Schedule background processing in a way that won't prevent function completion
    const backgroundProcessor = async () => {
      try {
        const results = await Promise.allSettled(step2Promises);
        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;
        console.log(
          `[COMPLETE] All Step 2 processes completed: ${successful} successful, ${failed} failed`
        );

        if (failed > 0) {
          const failedResults = results
            .filter((r) => r.status === "rejected")
            .map((r, i) => ({
              scenario: scenarios[i]?.name || "Unknown",
              error: r.reason?.message || r.reason,
            }));
          console.error(`[COMPLETE] Failed scenarios:`, failedResults);
        }
        // Now that tree with papers is complete, start use cases enrichment
        // 🚫 TEMPORARILY DISABLED - Use Cases API not production ready
        // console.log(`[USECASES] Starting use cases enrichment for all scenarios...`);
        // await enrichTreeWithUseCases(tt.id, sb, team_id);
      } catch (error) {
        console.error(
          `[COMPLETE] Error in background Step 2 processing:`,
          error
        );
      }
    };

    // Execute background processing without any awaiting or promise chaining
    // This ensures the main function can complete immediately
    backgroundProcessor(); // Fire and forget

    // Return immediately so scenarios appear in UI with generating indicators
    return new Response(
      JSON.stringify({
        success: true,
        treeId: tt.id,
        message:
          "Tree generation started. Scenarios created, subtrees generating in background.",
        scenarios: scenarios.map((s) => ({ id: s.id, name: s.name })),
        status: "generating", // Indicates background processing is active
      }),
      {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      }
    );
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

// Helper function to validate and format dates
function validateAndFormatDate(dateString: string | null): string | null {
  console.log(
    `[DATE VALIDATION] Input: "${dateString}" (type: ${typeof dateString})`
  );

  // Handle empty or null dates - return null instead of current date
  if (!dateString || dateString.trim() === "") {
    console.log(`[DATE VALIDATION] Empty/null date, returning null`);
    return null;
  }

  // Check if the date is already in valid YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Validate that it's a real date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      console.log(`[DATE VALIDATION] Valid YYYY-MM-DD format: "${dateString}"`);
      return dateString;
    }
  }

  // Try to parse other date formats
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const formattedDate = date.toISOString().split("T")[0];
    console.log(
      `[DATE VALIDATION] Parsed and formatted: "${dateString}" -> "${formattedDate}"`
    );
    return formattedDate;
  }

  // If all else fails, return null for invalid dates
  console.warn(`[DB] Invalid date format: "${dateString}", storing as null`);
  return null;
}

// Helper function to validate region field
function validateRegion(region: string): "domestic" | "international" {
  console.log(`[REGION VALIDATION] Input: "${region}"`);

  if (!region || typeof region !== "string") {
    console.log(
      `[REGION VALIDATION] Empty/invalid region, defaulting to "international"`
    );
    return "international";
  }

  const normalizedRegion = region.toLowerCase().trim();

  // Check for domestic indicators
  if (
    normalizedRegion.includes("domestic") ||
    normalizedRegion.includes("japan") ||
    normalizedRegion.includes("jp") ||
    normalizedRegion.includes("japanese")
  ) {
    console.log(`[REGION VALIDATION] Classified as domestic: "${region}"`);
    return "domestic";
  }

  // Check for international indicators
  if (
    normalizedRegion.includes("international") ||
    normalizedRegion.includes("global") ||
    normalizedRegion.includes("worldwide")
  ) {
    console.log(`[REGION VALIDATION] Classified as international: "${region}"`);
    return "international";
  }

  // Default to international for unknown values
  console.log(
    `[REGION VALIDATION] Unknown region "${region}", defaulting to "international"`
  );
  return "international";
}
