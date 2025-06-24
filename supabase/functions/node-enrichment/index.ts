// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface NodeEnrichmentRequest {
  nodeId: string;
  treeId: string;
  nodeTitle: string;
  nodeDescription?: string;
  query: string;
  parentTitles: string[];
  team_id?: string | null;
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string | null;
  citations: number;
  region: string;
  doi: string;
  url: string;
  score: number;
}

interface UseCase {
  id: string;
  product: string;
  company: string[];
  description: string;
  press_releases: string[];
}

interface SearchArticleRequest {
  query: string;
}

interface SearchArticleResponse {
  papers: Paper[];
  total_count: number;
}

interface SearchMarketImplRequest {
  query: string;
}

interface SearchMarketImplResponse {
  use_cases: UseCase[];
  total_count: number;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Basic-Auth helper for production APIs
 */
function makeBasicAuthHeader(): string {
  const user = Deno.env.get("SEARCH_API_USER") ?? "admin";
  const pass = Deno.env.get("SEARCH_API_PASS") ?? "adminpassword";
  return "Basic " + btoa(`${user}:${pass}`);
}

/**
 * Call search_article API for a specific node
 */
async function callSearchArticleAPI(
  request: SearchArticleRequest
): Promise<SearchArticleResponse> {
  console.log(`[SEARCH_ARTICLE] Calling API with query: ${request.query}`);

  const res = await fetch(`https://search-api.memoryai.jp/search_article?query=${encodeURIComponent(request.query)}`, {
    method: "GET",
    headers: {
      Authorization: makeBasicAuthHeader(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[SEARCH_ARTICLE ERROR] API call failed with status ${res.status}:`,
      text
    );
    throw new Error(`search_article API ${res.status}: ${text}`);
  }

  const responseText = await res.text();
  console.log("[SEARCH_ARTICLE] Raw API response:", responseText);
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error("[SEARCH_ARTICLE] JSON parsing failed:", e.message);
    // If parsing fails, we can't proceed, so we'll treat it as no results.
    // This could happen if the API returns an HTML error page, for example.
    responseData = { papers: [], total_count: 0 };
  }

  // The API sometimes returns a raw array of papers instead of the expected object.
  if (Array.isArray(responseData)) {
    responseData = {
      papers: responseData,
      total_count: responseData.length,
    };
  }

  console.log(
    `[SEARCH_ARTICLE] Received ${
      responseData.papers?.length || 0
    } papers for query: ${request.query}`
  );

  return responseData;
}

/**
 * Call search_market_impl API for a specific node
 */
async function callSearchMarketImplAPI(
  request: SearchMarketImplRequest
): Promise<SearchMarketImplResponse> {
  console.log(
    `[SEARCH_MARKET_IMPL] Calling API with query: ${request.query}`
  );

  const res = await fetch(
    `https://search-api.memoryai.jp/search_market_impl?query=${encodeURIComponent(request.query)}`,
    {
      method: "GET",
      headers: {
        Authorization: makeBasicAuthHeader(),
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[SEARCH_MARKET_IMPL ERROR] API call failed with status ${res.status}:`,
      text
    );
    throw new Error(`search_market_impl API ${res.status}: ${text}`);
  }

  const responseText = await res.text();
  console.log("[SEARCH_MARKET_IMPL] Raw API response:", responseText);
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error("[SEARCH_MARKET_IMPL] JSON parsing failed:", e.message);
    responseData = { use_cases: [], total_count: 0 };
  }

  // The API sometimes returns a raw array of use cases instead of the expected object.
  if (Array.isArray(responseData)) {
    responseData = {
      use_cases: responseData,
      total_count: responseData.length,
    };
  }

  console.log(
    `[SEARCH_MARKET_IMPL] Received ${
      responseData.use_cases?.length || 0
    } use cases for query: ${request.query}`
  );

  return responseData;
}

/**
 * Mock search_article API for fallback
 */
async function mockSearchArticleAPI(
  query: string
): Promise<SearchArticleResponse> {
  console.log(
    `[MOCK SEARCH_ARTICLE] Generating mock papers for query: ${query}`
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const paperCount = Math.floor(Math.random() * 5) + 1;
  const papers: Paper[] = [];

  for (let i = 0; i < paperCount; i++) {
    const paperId = crypto.randomUUID();
    papers.push({
      id: paperId,
      title: `${query}: Research Paper ${i + 1}`,
      authors: generateMockAuthors(),
      journal: generateMockJournal(),
      tags: generateMockTags(query),
      abstract: `This paper explores advanced techniques in ${query.toLowerCase()}. The research demonstrates significant improvements in performance and efficiency through innovative approaches.`,
      date: generateRandomDate(),
      citations: Math.floor(Math.random() * 200) + 10,
      region: Math.random() > 0.5 ? "international" : "domestic",
      doi: `10.1000/mock.${paperId.split("-")[0]}`,
      url: `https://example.com/paper/${paperId}`,
      score: Math.random() * 100,
    });
  }

  return {
    papers,
    total_count: papers.length,
  };
}

/**
 * Mock search_market_impl API for fallback
 */
async function mockSearchMarketImplAPI(
  query: string
): Promise<SearchMarketImplResponse> {
  console.log(
    `[MOCK SEARCH_MARKET_IMPL] Generating mock use cases for query: ${query}`
  );


  const useCaseCount = Math.floor(Math.random() * 3) + 1;
  const useCases: UseCase[] = [];

  for (let i = 0; i < useCaseCount; i++) {
    const useCaseId = crypto.randomUUID();
    const pressReleasesCount = Math.floor(Math.random() * 3) + 1;

    const pressReleases: string[] = [];
    for (let j = 0; j < pressReleasesCount; j++) {
      pressReleases.push(
        `${query} Implementation News ${
          j + 1
        }: Revolutionary breakthrough in practical applications`
      );
    }

    const companies = generateMockCompanies();

    useCases.push({
      id: useCaseId,
      product: `${query} Solution ${i + 1}`,
      company: companies,
      description: `Real-world implementation of ${query.toLowerCase()} technology demonstrating practical applications and measurable results.`,
      press_releases: pressReleases,
    });
  }

  return {
    use_cases: useCases,
    total_count: useCases.length,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if papers already exist for a specific node
 */
async function checkPapersExist(
  supabaseClient: any,
  nodeId: string
): Promise<boolean> {
  const { count, error } = await supabaseClient
    .from("node_papers")
    .select("id", { count: "exact", head: true })
    .eq("node_id", nodeId);

  if (error) {
    console.warn(
      `[CHECK_PAPERS] Error checking for existing papers for node ${nodeId}:`,
      error
    );
    return false; // Assume they don't exist on error
  }

  console.log(`[CHECK_PAPERS] Found ${count} existing papers for node ${nodeId}.`);
  return (count ?? 0) > 10;
}

/**
 * Check if use cases already exist for a specific node
 */
async function checkUseCasesExist(
  supabaseClient: any,
  nodeId: string
): Promise<boolean> {
  const { count, error } = await supabaseClient
    .from("node_use_cases")
    .select("id", { count: "exact", head: true })
    .eq("node_id", nodeId);

  if (error) {
    console.warn(
      `[CHECK_USECASES] Error checking for existing use cases for node ${nodeId}:`,
      error
    );
    return false; // Assume they don't exist on error
  }
  console.log(`[CHECK_USECASES] Found ${count} existing use cases for node ${nodeId}.`);
  return (count ?? 0) > 0;
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

  // First, delete existing papers for this node to avoid duplicates
  const { error: deleteError } = await supabaseClient
    .from("node_papers")
    .delete()
    .eq("node_id", nodeId);

  if (deleteError) {
    console.warn(
      `[SAVE_PAPERS] Failed to delete existing papers for node ${nodeId}:`,
      deleteError
    );
  }

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

  console.log(
    `[SAVE_PAPERS] Successfully saved ${papers.length} papers for node: ${nodeId}`
  );
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

  // First, delete existing use cases for this node to avoid duplicates
  const { error: deleteError } = await supabaseClient
    .from("node_use_cases")
    .delete()
    .eq("node_id", nodeId);

  if (deleteError) {
    console.warn(
      `[SAVE_USECASES] Failed to delete existing use cases for node ${nodeId}:`,
      deleteError
    );
  }

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
        `[SAVE_USECASES ERROR] Failed to save use case:`,
        useCaseError
      );
      throw new Error(
        `Failed to save use case for node ${nodeId}: ${useCaseError.message}`
      );
    }
  }

  console.log(
    `[SAVE_USECASES] Successfully saved ${useCases.length} use cases for node: ${nodeId}`
  );
}

/**
 * Helper function to validate and format dates
 */
function validateAndFormatDate(dateString: string | null): string | null {
  if (!dateString || dateString.trim() === "") {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return dateString;
    }
  }

  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  }

  console.warn(
    `[VALIDATE_DATE] Invalid date format: "${dateString}", storing as null`
  );
  return null;
}

/**
 * Helper function to validate region field
 */
function validateRegion(region: string): "domestic" | "international" {
  if (!region || typeof region !== "string") {
    return "international";
  }

  const normalizedRegion = region.toLowerCase().trim();

  if (
    normalizedRegion.includes("domestic") ||
    normalizedRegion.includes("japan") ||
    normalizedRegion.includes("jp") ||
    normalizedRegion.includes("japanese")
  ) {
    return "domestic";
  }

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
// CORS AND EDGE FUNCTION SETUP
// =============================================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Streaming response types
interface StreamingResponse {
  type: 'papers' | 'useCases' | 'complete' | 'error';
  data?: any;
  error?: string;
  nodeId: string;
  timestamp: string;
}

/*──────────────────── edge entry ────────────────*/
serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { status: 200, headers: CORS });

  try {
    const requestBody = await req.json();
    console.log(`[NODE_ENRICHMENT] Received request:`, {
      method: req.method,
      hasNodeId: !!requestBody.nodeId,
      hasTreeId: !!requestBody.treeId,
      hasNodeTitle: !!requestBody.nodeTitle,
      hasQuery: !!requestBody.query,
      parentTitlesLength: requestBody.parentTitles?.length || 0,
    });

    const {
      nodeId,
      treeId,
      nodeTitle,
      nodeDescription,
      query,
      parentTitles,
      team_id,
      streaming = false, // Add streaming parameter
      enrichType, // Add enrichType parameter: 'papers', 'useCases', or undefined (both)
    } = requestBody as NodeEnrichmentRequest & { streaming?: boolean; enrichType?: 'papers' | 'useCases' };

    // Validate required parameters
    if (!nodeId || !treeId || !nodeTitle || !query || parentTitles === undefined || parentTitles === null) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
          required: ["nodeId", "treeId", "nodeTitle", "query", "parentTitles"],
        }),
        {
          status: 400,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );
    }

    // Validate parentTitles is an array
    if (!Array.isArray(parentTitles)) {
      return new Response(
        JSON.stringify({
          error: "Invalid parameter type",
          message: "parentTitles must be an array",
        }),
        {
          status: 400,
          headers: { ...CORS, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ROLE_KEY) {
      throw new Error("Server mis-config (Supabase env vars)");
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    // Check if data already exists in the database
    const [papersExist, useCasesExist] = await Promise.all([
      checkPapersExist(sb, nodeId),
      checkUseCasesExist(sb, nodeId),
    ]);

    // Determine what to skip based on enrichType and existing data
    let skipPapers = papersExist;
    let skipUseCases = useCasesExist;

    if (enrichType === 'papers') {
      skipUseCases = true; // Only process papers
    } else if (enrichType === 'useCases') {
      skipPapers = true; // Only process use cases
    }

    console.log(
      `[NODE_ENRICHMENT] Pre-flight check for node ${nodeId}:`, {
        skipPapers,
        skipUseCases,
        enrichType: enrichType || 'both',
        papersExist,
        useCasesExist
      }
    );

    console.log(
      `[NODE_ENRICHMENT] Starting enrichment for node: ${nodeTitle} (ID: ${nodeId})`
    );

    // Build the query string using the API format: query + "," + parentTitles.join(",") + nodeTitle + nodeDescription
    const nodeDesc = nodeDescription || "";
    const parentTitlesStr = Array.isArray(parentTitles) ? parentTitles.join(",") : "";

    const searchQuery = [
      query,
      parentTitlesStr,
      nodeTitle,
      nodeDesc
    ].filter(part => part && part.trim() !== "").join(",");

    console.log(`[NODE_ENRICHMENT] Built query: ${searchQuery}`);

    // Handle streaming vs non-streaming responses
    if (streaming) {
      return handleStreamingResponse(sb, nodeId, treeId, searchQuery, team_id || null, skipPapers, skipUseCases);
    } else {
      return handleTraditionalResponse(sb, nodeId, treeId, nodeTitle, searchQuery, team_id || null, skipPapers, skipUseCases);
    }
  } catch (err: any) {
    console.error("=== NODE ENRICHMENT ERROR ===");
    console.error("Error details:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      cause: err.cause,
    });

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

/**
 * Handle streaming response - sends data as each API completes
 */
async function handleStreamingResponse(
  sb: any,
  nodeId: string,
  treeId: string,
  searchQuery: string,
  team_id: string | null,
  skipPapers: boolean,
  skipUseCases: boolean
): Promise<Response> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Helper function to send data chunk
      const sendChunk = (response: StreamingResponse) => {
        const chunk = `data: ${JSON.stringify(response)}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      };

      // Process papers and use cases independently
      const processPapers = async () => {
        if (skipPapers) return;

        try {
          console.log("[STREAMING] Starting papers API call");
          const articleRequest: SearchArticleRequest = { query: searchQuery };

          let paperResult: SearchArticleResponse;
          try {
            paperResult = await callSearchArticleAPI(articleRequest);
          } catch (error) {
            console.warn("[STREAMING] Papers API failed, using mock:", error.message);
            paperResult = await mockSearchArticleAPI(searchQuery);
          }

          const papers = paperResult.papers || [];
          console.log(`[STREAMING] Got ${papers.length} papers, saving to database`);

          // Save papers to database
          await saveNodePapers(sb, nodeId, treeId, papers, team_id);

          // Send papers response
          sendChunk({
            type: 'papers',
            data: {
              papers,
              count: papers.length,
              saved: true
            },
            nodeId,
            timestamp: new Date().toISOString()
          });

          console.log("[STREAMING] Papers completed and sent");
        } catch (error) {
          console.error("[STREAMING] Papers processing failed:", error);
          sendChunk({
            type: 'error',
            error: `Papers processing failed: ${error.message}`,
            nodeId,
            timestamp: new Date().toISOString()
          });
        }
      };

      const processUseCases = async () => {
        if (skipUseCases) return;

        try {
          console.log("[STREAMING] Starting use cases API call");
          const marketImplRequest: SearchMarketImplRequest = { query: searchQuery };

          let useCaseResult: SearchMarketImplResponse;
          try {
            useCaseResult = await callSearchMarketImplAPI(marketImplRequest);
          } catch (error) {
            console.warn("[STREAMING] Use cases API failed, using mock:", error.message);
            useCaseResult = await mockSearchMarketImplAPI(searchQuery);
          }

          const useCases = useCaseResult.use_cases || [];
          console.log(`[STREAMING] Got ${useCases.length} use cases, saving to database`);

          // Save use cases to database
          await saveNodeUseCases(sb, nodeId, treeId, useCases, team_id);

          // Send use cases response
          sendChunk({
            type: 'useCases',
            data: {
              useCases,
              count: useCases.length,
              saved: true
            },
            nodeId,
            timestamp: new Date().toISOString()
          });

          console.log("[STREAMING] Use cases completed and sent");
        } catch (error) {
          console.error("[STREAMING] Use cases processing failed:", error);
          sendChunk({
            type: 'error',
            error: `Use cases processing failed: ${error.message}`,
            nodeId,
            timestamp: new Date().toISOString()
          });
        }
      };

      // Run both processes concurrently
      Promise.all([processPapers(), processUseCases()]).then(() => {
        // Send completion signal
        sendChunk({
          type: 'complete',
          nodeId,
          timestamp: new Date().toISOString()
        });
        controller.close();
      }).catch((error) => {
        console.error("[STREAMING] Fatal error:", error);
        sendChunk({
          type: 'error',
          error: `Fatal error: ${error.message}`,
          nodeId,
          timestamp: new Date().toISOString()
        });
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      ...CORS,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Handle traditional response - waits for both APIs to complete
 */
async function handleTraditionalResponse(
  sb: any,
  nodeId: string,
  treeId: string,
  nodeTitle: string,
  searchQuery: string,
  team_id: string | null,
  skipPapers: boolean,
  skipUseCases: boolean
): Promise<Response> {
  const articleRequest: SearchArticleRequest = { query: searchQuery };
  const marketImplRequest: SearchMarketImplRequest = { query: searchQuery };

  // Call both APIs concurrently for efficiency
  const paperPromise = skipPapers
    ? Promise.resolve(null)
    : callSearchArticleAPI(articleRequest).catch(async (error) => {
        console.warn(
          `[NODE_ENRICHMENT] search_article API failed, using mock:`,
          error.message
        );
        return await mockSearchArticleAPI(searchQuery);
      });

  const useCasePromise = skipUseCases
    ? Promise.resolve(null)
    : callSearchMarketImplAPI(marketImplRequest).catch(async (error) => {
        console.warn(
          `[NODE_ENRICHMENT] search_market_impl API failed, using mock:`,
          error.message
        );
        return await mockSearchMarketImplAPI(searchQuery);
      });

  const [paperResult, useCaseResult] = await Promise.allSettled([
    paperPromise,
    useCasePromise,
  ]);

  let papers: Paper[] = [];
  let useCases: UseCase[] = [];
  let errors: string[] = [];

  // Process search_article results
  if (paperResult.status === "fulfilled" && paperResult.value) {
    papers = paperResult.value.papers || [];
  } else if (paperResult.status === "rejected") {
    errors.push(`search_article failed: ${paperResult.reason}`);
  }

  // Process search_market_imple results
  if (useCaseResult.status === "fulfilled" && useCaseResult.value) {
    useCases = useCaseResult.value.use_cases || [];
  } else if (useCaseResult.status === "rejected") {
    errors.push(`search_market_impl failed: ${useCaseResult.reason}`);
  }

  // Save results to database concurrently
  const saveResults = await Promise.allSettled([
    skipPapers
      ? Promise.resolve()
      : saveNodePapers(sb, nodeId, treeId, papers, team_id || null),
    skipUseCases
      ? Promise.resolve()
      : saveNodeUseCases(sb, nodeId, treeId, useCases, team_id || null),
  ]);

  // Check for save errors
  if (saveResults[0].status === "rejected") {
    errors.push(`Failed to save papers: ${saveResults[0].reason}`);
  }

  if (saveResults[1].status === "rejected") {
    errors.push(`Failed to save use cases: ${saveResults[1].reason}`);
  }

  const response = {
    success: true,
    nodeId,
    nodeTitle,
    results: {
      papers: {
        count: papers.length,
        saved: !skipPapers && saveResults[0].status === "fulfilled",
      },
      useCases: {
        count: useCases.length,
        saved: !skipUseCases && saveResults[1].status === "fulfilled",
      },
    },
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  };

  console.log(
    `[NODE_ENRICHMENT] Completed enrichment for node: ${nodeTitle}`,
    response
  );

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
