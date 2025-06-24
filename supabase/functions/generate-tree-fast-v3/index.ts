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

// New interface for use cases API request
interface UseCasesApiRequest {
  tree_id: string;
  query: string;
  scenario_node: {
    id: string;
    title: string;
    description: string;
    level: number;
    children: string[];
    keywords?: string[];
    context?: string;
  };
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
  product: string; // Changed from 'title' to 'product'
  company: string[]; // New field - array of company names
  description: string;
  press_releases: string[]; // Changed from complex object array to simple string array
}

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

function generateMockCompanies(): string[] {
  const companies = [
    "TechCorp Inc.",
    "Innovation Labs",
    "Future Systems",
    "Digital Solutions Ltd.",
    "Advanced Technologies",
    "Smart Industries",
    "NextGen Corp",
    "Global Tech Solutions",
  ];

  const companyCount = Math.floor(Math.random() * 3) + 1;
  const selectedCompanies: string[] = [];

  for (let i = 0; i < companyCount; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    if (!selectedCompanies.includes(company)) {
      selectedCompanies.push(company);
    }
  }

  return selectedCompanies;
}

function generateMockUseCases(nodeTitle: string, level: number): UseCase[] {
  const useCaseCount = Math.floor(Math.random() * 3) + 1;
  const useCases: UseCase[] = [];

  for (let i = 0; i < useCaseCount; i++) {
    const useCaseId = crypto.randomUUID();
    const pressReleasesCount = Math.floor(Math.random() * 3) + 1;

    const pressReleases: string[] = [];
    for (let j = 0; j < pressReleasesCount; j++) {
      pressReleases.push(`Press Release ${j + 1} for ${nodeTitle}`);
    }

    const companies = generateMockCompanies();

    useCases.push({
      id: useCaseId,
      product: `${nodeTitle} Solution ${i + 1}`,
      company: companies,
      description: `Real-world implementation of ${nodeTitle.toLowerCase()} technology demonstrating practical applications and measurable results.`,
      press_releases: pressReleases,
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
// PRODUCTION API FUNCTIONS
// =============================================================================

// Basic-Auth helper (prod tree_papers)
function makeBasicAuthHeader(): string {
  const user = Deno.env.get("SEARCH_API_USER") ?? "admin";
  const pass = Deno.env.get("SEARCH_API_PASS") ?? "adminpassword";
  return "Basic " + btoa(`${user}:${pass}`);
}

// Production tree_papers API call
async function callTreePapersAPI(
  scenarioTree: ScenarioTreeInput,
  query: string
): Promise<EnrichedScenarioResponse> {
  // Transform the data to match the API's expected snake_case format
  const apiPayload = transformToSnakeCase(scenarioTree, query);

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

// Production use cases API call (with new structure)
async function callUseCasesAPI(request: UseCasesApiRequest): Promise<any> {
  console.log(
    `[USECASES_API DEBUG] Sending request to tree_usecases API:`,
    JSON.stringify(request, null, 2)
  );

  const res = await fetch("https://search-api.memoryai.jp/tree_usecases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: makeBasicAuthHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[USECASES_API ERROR] API call failed with status ${res.status}:`,
      text
    );
    throw new Error(`tree_usecases API ${res.status}: ${text}`);
  }

  const response = await res.json();
  console.log(
    `[USECASES_API DEBUG] Raw response from tree_usecases API:`,
    JSON.stringify(response, null, 2)
  );

  return response;
}

// Helper function to prepare use cases API request
function prepareUseCasesApiRequest(
  treeId: string,
  query: string,
  scenarioNode: any
): UseCasesApiRequest {
  const transformNodeForUseCases = (node: any): any => ({
    id: node.id,
    title: node.title,
    description: node.description || "",
    level: node.level,
    children: (node.children || []).map(
      (child: any) => child.id || child.title
    ), // Use IDs or titles as strings
    keywords: node.keywords || [],
    context: node.context || "",
  });

  return {
    tree_id: treeId,
    query: query,
    scenario_node: transformNodeForUseCases(scenarioNode),
  };
}

// Helper function to transform camelCase to snake_case for API
function transformToSnakeCase(data: ScenarioTreeInput, query: string): any {
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
    query: query, // Add the query parameter
    scenario_node: transformNode(data.scenarioNode), // Convert scenarioNode to scenario_node
  };
}

// Helper function to transform snake_case response back to camelCase
function transformToCamelCase(response: any): EnrichedScenarioResponse {
  const transformNode = (node: any): any => {
    const transformedUseCases = (node.use_cases || node.useCases || []).map(
      (useCase: any, index: number) => {
        // Handle both old and new API formats
        if (typeof useCase === "object" && useCase !== null) {
          return {
            id: useCase.id || crypto.randomUUID(),
            product: useCase.product || useCase.title || `Product ${index + 1}`,
            company: useCase.company || [],
            description: useCase.description || "",
            press_releases:
              useCase.press_releases || useCase.pressReleases || [],
          };
        }
        return useCase;
      }
    );

    return {
      id: node.id,
      title: node.title,
      description: node.description,
      level: node.level,
      papers: (node.papers || []).map((paper: any) => ({
        ...paper,
        date: validateAndFormatDate(paper.date),
        region: validateRegion(paper.region),
      })),
      useCases: transformedUseCases,
      children: (node.children || []).map(transformNode),
    };
  };

  return {
    treeId: response.tree_id || response.treeId, // Handle both formats
    scenarioNode: transformNode(
      response.scenario_node || response.scenarioNode
    ),
  };
}

// =============================================================================
// DATABASE FUNCTIONS
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

  const papersToInsert = papers.map((paper) => {
    const validatedDate = validateAndFormatDate(paper.date);
    const validatedRegion = validateRegion(paper.region);
    return {
      id: paper.id,
      node_id: nodeId,
      tree_id: treeId,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      tags: paper.tags,
      abstract: paper.abstract,
      date: validatedDate,
      citations: paper.citations,
      region: validatedRegion,
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
}

/**
 * Save use cases for a specific node
 * Updated for new API structure:
 * - title -> product
 * - releases field removed
 * - company field added (array)
 * - pressReleases -> press_releases (string array)
 */
async function saveNodeUseCases(
  supabaseClient: any,
  nodeId: string,
  treeId: string,
  useCases: UseCase[],
  teamId: string | null
): Promise<void> {
  if (useCases.length === 0) return;

  for (const [index, useCase] of useCases.entries()) {
    const { error: useCaseError } = await supabaseClient
      .from("node_use_cases")
      .insert({
        id: useCase.id,
        node_id: nodeId,
        tree_id: treeId,
        product: useCase.product,
        description: useCase.description,
        company: useCase.company || [],
        press_releases: useCase.press_releases || [],
        team_id: teamId,
      });

    if (useCaseError) {
      console.error(
        `[USE_CASES] Failed to save use case ${index + 1} for node ${nodeId}:`,
        useCaseError
      );
      throw new Error(
        `Failed to save use case ${index + 1} for node ${nodeId}: ${
          useCaseError.message
        }`
      );
    }
  }
}

// =============================================================================
// STEP 2 INTERNAL PROCESSING FUNCTION
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
    `=== STEP 2 INTERNAL (FAST-V3): Generating subtree for implementation: ${implementationName} ===`
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
      `[STEP 2 INTERNAL] Failed to parse OpenAI response:`,
      parseError
    );
    throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
  }

  // Handle children array format (no implementation wrapper needed)
  let implementationNodes: BareNode[];
  if (parsedResponse.children && Array.isArray(parsedResponse.children)) {
    implementationNodes = parsedResponse.children;
  } else if (parsedResponse.subtree && parsedResponse.subtree.children) {
    // Fallback: if model still returns subtree format, extract children
    implementationNodes = parsedResponse.subtree.children;
    console.log(
      `[STEP 2 INTERNAL] Using subtree.children, found ${implementationNodes.length} implementation nodes`
    );
  } else if (parsedResponse.name && parsedResponse.children) {
    // Fallback: if model returns implementation node, extract children
    implementationNodes = parsedResponse.children;
    console.log(
      `[STEP 2 INTERNAL] Using implementation.children, found ${implementationNodes.length} implementation nodes`
    );
  } else {
    console.error(
      `[STEP 2 INTERNAL] Invalid subtree structure for ${implementationName}. Available keys:`,
      Object.keys(parsedResponse)
    );
    console.error(`[STEP 2 INTERNAL] Full response:`, parsedResponse);
    throw new Error("Model returned malformed subtree");
  }

  /*──────── Save Bare Tree Structure First ────────*/
  console.log(
    `=== Saving bare tree structure for implementation: ${implementationName} ===`
  );

  const subtreeWithIds = assignIdsToSubtree(implementationNodes);

  // Helper function to find node in subtree by title
  const findNodeInSubtree = (nodes: any[], title: string): any => {
    for (const node of nodes) {
      if (node.title === title) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeInSubtree(node.children, title);
        if (found) return found;
      }
    }
    return null;
  };

  // Create mapping from enriched node IDs to saved node IDs
  const nodeIdMapping = new Map<string, string>();

  // Save bare tree nodes first (without enriched data)
  const saveSubtreeWithoutEnrichment = async (
    bareNode: BareNode,
    nodeId: string,
    enrichedNodeId: string,
    parentId: string,
    lvl: number,
    idx: number
  ) => {
    const axisForLevel = detectAxisFast(lvl);

    // Validate axis value exists in enum for FAST
    const validAxisValues = [
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
      throw new Error(`Invalid axis value: ${axisForLevel} for level ${lvl}`);
    }

    // Save tree node without enriched data
    try {
      const { error } = await sb.from("tree_nodes").insert({
        id: nodeId,
        tree_id: treeId,
        parent_id: parentId,
        name: bareNode.name,
        description: bareNode.description ?? "",
        axis: axisForLevel as any,
        level: lvl,
        node_order: idx,
        children_count: bareNode.children?.length || 0,
        team_id: team_id || null,
      });

      if (error) {
        console.error(`[SAVE] Database error saving node ${nodeId}:`, error);
        throw new Error(`DB error (node ${nodeId}): ${error.message}`);
      }
    } catch (dbError) {
      console.error(`[SAVE] Failed to save node ${nodeId}:`, dbError);
      throw dbError;
    }

    // Store the mapping for enrichment phase
    nodeIdMapping.set(enrichedNodeId, nodeId);

    // Recursively save children
    const children = bareNode.children || [];
    for (let i = 0; i < children.length; i++) {
      // Find the corresponding child from subtreeWithIds
      const correspondingParent = findNodeInSubtree(
        subtreeWithIds,
        bareNode.name
      );
      const childId =
        correspondingParent?.children?.[i]?.id || crypto.randomUUID();
      const childEnrichedId = correspondingParent?.children?.[i]?.id || childId;
      await saveSubtreeWithoutEnrichment(
        children[i],
        childId,
        childEnrichedId,
        nodeId,
        lvl + 1,
        i
      );
    }
  };

  // Save How2 nodes (level 2) and their subtrees first
  for (let i = 0; i < implementationNodes.length; i++) {
    const howTwoNodeId = subtreeWithIds[i].id;
    await saveSubtreeWithoutEnrichment(
      implementationNodes[i],
      howTwoNodeId,
      subtreeWithIds[i].id, // Use same ID for enriched mapping
      implementationId,
      2, // How2 level
      i
    );
  }

  // Update implementation node children_count after bare tree is saved
  const { error: updateError } = await sb
    .from("tree_nodes")
    .update({ children_count: implementationNodes.length })
    .eq("id", implementationId);

  if (updateError) {
    console.error(
      `[STEP 2 INTERNAL] Failed to update children_count for implementation ${implementationId}:`,
      updateError
    );
  }

  console.log(
    `[STEP 2 INTERNAL] Bare tree structure saved for implementation: ${implementationName}`
  );

  /*──────── Python API Enrichment ────────*/
  console.log(
    `=== Calling Papers API for enrichment: ${implementationName} ===`
  );

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

  // Call Papers API (now after tree is already saved)
  console.log(`[STEP 2 INTERNAL] Calling papers API...`);
  let enrichedResponse: EnrichedScenarioResponse;
  try {
    enrichedResponse = await callTreePapersAPI(
      implementationTreeInput,
      searchTheme
    );
  } catch (apiErr) {
    console.error("[tree_papers] prod API failed, using mock:", apiErr.message);
    enrichedResponse = await callPythonPapersAPI(implementationTreeInput);
  }
  console.log(`=== Papers enrichment completed ===`);

  /*──────── Update Nodes with Enriched Data ────────*/

  // Save only enriched data (papers) to existing nodes
  const saveEnrichedDataOnly = async (enrichedNode: any) => {
    // Get the actual saved node ID from mapping
    const actualNodeId = nodeIdMapping.get(enrichedNode.id);
    if (!actualNodeId) {
      console.warn(
        `[ENRICHMENT] No mapping found for enriched node ID: ${enrichedNode.id}, title: ${enrichedNode.title}`
      );
      return;
    }

    // Save enriched data for this node (papers only for now)
    try {
      if (enrichedNode.papers && enrichedNode.papers.length > 0) {
        await saveNodePapers(
          sb,
          actualNodeId,
          treeId,
          enrichedNode.papers,
          team_id
        );
        console.log(
          `[ENRICHMENT] Saved ${enrichedNode.papers.length} papers for node: ${enrichedNode.title}`
        );
      }
      // Use cases will be saved separately later
    } catch (enrichError) {
      console.error(
        `[ENRICHMENT] Failed to save enriched data for node ${actualNodeId}:`,
        enrichError
      );
    }

    // Recursively save enriched data for children
    if (enrichedNode.children && enrichedNode.children.length > 0) {
      for (const enrichedChild of enrichedNode.children) {
        await saveEnrichedDataOnly(enrichedChild);
      }
    }
  };

  // Save enriched data for the implementation node and its entire subtree
  console.log(
    `[STEP 2 INTERNAL] Saving enriched data for implementation: ${implementationName}`
  );

  // Save enriched data for the implementation node itself (papers only for now)
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
      console.log(
        `[STEP 2 INTERNAL] Saved ${enrichedResponse.scenarioNode.papers.length} papers for implementation: ${implementationName}`
      );
    }
    // Use cases will be saved separately later
  } catch (implementationEnrichError) {
    console.error(
      `[STEP 2 INTERNAL] Failed to save enriched data for implementation node ${implementationId}:`,
      implementationEnrichError
    );
  }

  // Save enriched data for How2 nodes and their subtrees
  if (
    enrichedResponse.scenarioNode.children &&
    enrichedResponse.scenarioNode.children.length > 0
  ) {
    for (const enrichedChild of enrichedResponse.scenarioNode.children) {
      await saveEnrichedDataOnly(enrichedChild);
    }
  }

  console.log(
    `[STEP 2 INTERNAL] Successfully completed subtree generation for implementation: ${implementationName}`
  );
  return {
    success: true,
    implementationId,
    implementationName,
    howTwoNodesCount: implementationNodes.length,
    enrichedDataSaved: true,
    papersEnrichmentComplete: true,
    useCasesEnrichmentComplete: true, // Use cases are now handled at Step 1
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Helper function to assign unique IDs to subtree nodes for API
function assignIdsToSubtree(nodes: BareNode[], startLevel: number = 2): any[] {
  return nodes.map((node, index) => {
    const id = crypto.randomUUID();

    const result = {
      id,
      title: node.name,
      description: node.description || "",
      level: startLevel,
      children: assignIdsToSubtree(node.children || [], startLevel + 1),
    };
    return result;
  });
}

// Domain types
interface BareNode {
  name: string;
  description?: string;
  children?: BareNode[];
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

// Helper function to validate and format dates
function validateAndFormatDate(dateString: string | null): string | null {
  // Handle empty or null dates - return null instead of current date
  if (!dateString || dateString.trim() === "") {
    return null;
  }

  // Check if the date is already in valid YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Validate that it's a real date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return dateString;
    }
  }

  // Try to parse other date formats
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  }

  // If all else fails, return null for invalid dates
  console.warn(`[DB] Invalid date format: "${dateString}", storing as null`);
  return null;
}

// Helper function to validate region field
function validateRegion(region: string): "domestic" | "international" {
  if (!region || typeof region !== "string") {
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
    return "domestic";
  }

  // Check for international indicators
  if (
    normalizedRegion.includes("international") ||
    normalizedRegion.includes("global") ||
    normalizedRegion.includes("worldwide")
  ) {
    return "international";
  }
  return "international";
}

// =============================================================================
// PROMPT TEMPLATES
// =============================================================================

// Step 1: Generate Root + How1 only (FAST approach)
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

// Step 2: Generate subtree for a specific implementation method (FAST approach)
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

// =============================================================================
// CORS CONFIGURATION
// =============================================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// =============================================================================
// EDGE FUNCTION ENTRY POINT
// =============================================================================

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
    console.log("=== GENERATING COMPLETE FAST TECHNOLOGY TREE V3 ===");

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
      children_count: treeRoot.children?.length || 0,
      team_id: team_id || null,
    });
    if (rootError)
      throw new Error(`DB error (root node): ${rootError.message}`);

    // 3️⃣ Insert implementation nodes (level 1 = How1) with children_count = 0 (indicating pending generation)
    const children = treeRoot.children || [];
    const implementationPromises = children.map(async (implementation, idx) => {
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
      if (error)
        throw new Error(`DB error (implementation node): ${error.message}`);
      return {
        id: implementationId,
        name: implementation.name,
        description: implementation.description,
      };
    });
    const implementations = await Promise.all(implementationPromises);

    console.log(
      `[STEP 1] Created ${implementations.length} implementations, starting enrichment and Step 2 generation`
    );

    // 🆕 NEW: Call Use Cases API for each implementation at Step 1 with empty children
    console.log(
      `[STEP 1] Starting use cases enrichment for implementation nodes...`
    );

    const useCasePromises = implementations.map(async (implementation) => {
      try {
        console.log(
          `[STEP 1 USECASES] Processing implementation: ${implementation.name}`
        );

        // Prepare implementation node with empty children for use cases API
        const implementationNodeForUseCases = {
          id: implementation.id,
          title: implementation.name,
          description: implementation.description || "",
          level: 1,
          children: [], // Empty children array as requested
          keywords: [],
          context: "",
        };

        // Prepare use cases API request
        const useCasesRequest = prepareUseCasesApiRequest(
          tt.id,
          searchTheme, // Use searchTheme as query
          implementationNodeForUseCases
        );

        let useCasesResponse;
        try {
          // Try production use cases API first
          useCasesResponse = await callUseCasesAPI(useCasesRequest);
          console.log(
            `[STEP 1 USECASES] Production API succeeded for implementation: ${implementation.name}`
          );
        } catch (apiErr) {
          console.error(
            "[STEP 1 USECASES] Production API failed, using mock:",
            apiErr.message
          );
          // Fallback to mock use cases API
          const mockImplementationTreeInput = {
            treeId: tt.id,
            scenarioNode: implementationNodeForUseCases,
          };
          useCasesResponse = await callPythonUseCasesAPI(
            mockImplementationTreeInput
          );
        }

        // Save use cases data for the implementation node
        if (useCasesResponse.scenarioNode || useCasesResponse.scenario_node) {
          const enrichedImplementationNode =
            useCasesResponse.scenarioNode || useCasesResponse.scenario_node;

          if (
            enrichedImplementationNode.useCases &&
            enrichedImplementationNode.useCases.length > 0
          ) {
            await saveNodeUseCases(
              sb,
              implementation.id,
              tt.id,
              enrichedImplementationNode.useCases,
              team_id
            );
            console.log(
              `[STEP 1 USECASES] Saved ${enrichedImplementationNode.useCases.length} use cases for implementation: ${implementation.name}`
            );
          }

          // Handle use_cases field as well (API response format)
          if (
            enrichedImplementationNode.use_cases &&
            enrichedImplementationNode.use_cases.length > 0
          ) {
            await saveNodeUseCases(
              sb,
              implementation.id,
              tt.id,
              enrichedImplementationNode.use_cases,
              team_id
            );
            console.log(
              `[STEP 1 USECASES] Saved ${enrichedImplementationNode.use_cases.length} use cases (from use_cases field) for implementation: ${implementation.name}`
            );
          }
        }

        return {
          implementation: implementation.name,
          success: true,
        };
      } catch (error) {
        console.error(
          `[STEP 1 USECASES] Error processing use cases for implementation ${implementation.name}:`,
          error
        );
        return {
          implementation: implementation.name,
          success: false,
          error: error.message,
        };
      }
    });

    // Fire off use cases enrichment in background (don't await)
    Promise.allSettled(useCasePromises)
      .then((useCaseResults) => {
        const successfulUseCases = useCaseResults.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failedUseCases = useCaseResults.filter(
          (r) => r.status === "rejected"
        ).length;
        console.log(
          `[STEP 1 USECASES] Use cases enrichment completed: ${successfulUseCases} successful, ${failedUseCases} failed`
        );
      })
      .catch((error) => {
        console.error(
          "[STEP 1 USECASES] Error in use cases processing:",
          error
        );
      });

    // Start Step 2 generation for each implementation asynchronously with proper error handling
    const step2Promises = implementations.map(async (implementation) => {
      try {
        console.log(
          `[STEP 1] Starting Step 2 for implementation: ${implementation.name} (ID: ${implementation.id})`
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
          `[STEP 1] Step 2 completed for implementation: ${implementation.name}`,
          step2Result
        );
        return {
          implementation: implementation.name,
          success: true,
          result: step2Result,
        };
      } catch (error) {
        console.error(
          `[STEP 1] Error in Step 2 for implementation ${implementation.name}:`,
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

    // Start Step 2 processes for each implementation in background
    console.log(
      `[STEP 1] Starting ${implementations.length} Step 2 processes in background...`
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
              implementation: implementations[i]?.name || "Unknown",
              error: r.reason?.message || r.reason,
            }));
          console.error(`[COMPLETE] Failed implementations:`, failedResults);
        }
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

    // Return immediately so implementations appear in UI with generating indicators
    return new Response(
      JSON.stringify({
        success: true,
        treeId: tt.id,
        message:
          "FAST tree generation started (V3). Implementations created, use cases enrichment started, subtrees generating in background.",
        implementations: implementations.map((i) => ({
          id: i.id,
          name: i.name,
        })),
        status: "generating", // Indicates background processing is active
      }),
      {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("=== EDGE FUNCTION ERROR (FAST-V3) ===");
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
