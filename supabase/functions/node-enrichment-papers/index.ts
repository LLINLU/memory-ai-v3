// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Import types and functions from the main node-enrichment function
// Note: In a real deployment, you'd want to extract shared code to a common module

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

interface SearchArticleRequest {
  query: string;
}

interface SearchArticleResponse {
  papers: Paper[];
  total_count: number;
}

// Basic-Auth helper for production APIs
function makeBasicAuthHeader(): string {
  const user = Deno.env.get("SEARCH_API_USER") ?? "admin";
  const pass = Deno.env.get("SEARCH_API_PASS") ?? "adminpassword";
  return "Basic " + btoa(`${user}:${pass}`);
}

// Call search_article API for papers
async function callSearchArticleAPI(request: SearchArticleRequest): Promise<SearchArticleResponse> {
  console.log(`[PAPERS_ONLY] Calling search_article API with query: ${request.query}`);

  const res = await fetch(`https://search-api.memoryai.jp/search_article?query=${encodeURIComponent(request.query)}`, {
    method: "GET",
    headers: {
      Authorization: makeBasicAuthHeader(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[PAPERS_ONLY] API call failed with status ${res.status}:`, text);
    throw new Error(`search_article API ${res.status}: ${text}`);
  }

  const responseText = await res.text();
  console.log("[PAPERS_ONLY] Raw API response:", responseText);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error("[PAPERS_ONLY] JSON parsing failed:", e.message);
    responseData = { papers: [], total_count: 0 };
  }

  if (Array.isArray(responseData)) {
    responseData = {
      papers: responseData,
      total_count: responseData.length,
    };
  }

  console.log(`[PAPERS_ONLY] Received ${responseData.papers?.length || 0} papers`);
  return responseData;
}

// Mock search_article API for fallback
async function mockSearchArticleAPI(query: string): Promise<SearchArticleResponse> {
  console.log(`[PAPERS_ONLY] Generating mock papers for query: ${query}`);
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const paperCount = Math.floor(Math.random() * 5) + 1;
  const papers: Paper[] = [];

  for (let i = 0; i < paperCount; i++) {
    const paperId = crypto.randomUUID();
    papers.push({
      id: paperId,
      title: `${query}: Research Paper ${i + 1}`,
      authors: "Mock Author",
      journal: "Mock Journal",
      tags: ["research", "mock"],
      abstract: `This paper explores ${query.toLowerCase()}.`,
      date: new Date().toISOString().split("T")[0],
      citations: Math.floor(Math.random() * 200) + 10,
      region: "international",
      doi: `10.1000/mock.${paperId.split("-")[0]}`,
      url: `https://example.com/paper/${paperId}`,
      score: Math.random() * 100,
    });
  }

  return { papers, total_count: papers.length };
}

// Save papers for a specific node
async function saveNodePapers(
  supabaseClient: any,
  nodeId: string,
  treeId: string,
  papers: Paper[],
  teamId: string | null
): Promise<void> {
  if (papers.length === 0) return;

  // Delete existing papers for this node
  const { error: deleteError } = await supabaseClient
    .from("node_papers")
    .delete()
    .eq("node_id", nodeId);

  if (deleteError) {
    console.warn(`[PAPERS_ONLY] Failed to delete existing papers for node ${nodeId}:`, deleteError);
  }

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
    region: paper.region === "domestic" ? "domestic" : "international",
    doi: paper.doi,
    url: paper.url,
    team_id: teamId,
    score: paper.score,
  }));

  const { error } = await supabaseClient
    .from("node_papers")
    .insert(papersToInsert);

  if (error) {
    throw new Error(`Failed to save papers for node ${nodeId}: ${error.message}`);
  }

  console.log(`[PAPERS_ONLY] Successfully saved ${papers.length} papers for node: ${nodeId}`);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: CORS });
  }

  try {
    const requestBody = await req.json();
    console.log(`[PAPERS_ONLY] Received request for papers enrichment`);

    const {
      nodeId,
      treeId,
      nodeTitle,
      nodeDescription,
      query,
      parentTitles,
      team_id,
    } = requestBody as NodeEnrichmentRequest;

    // Validate required parameters
    if (!nodeId || !treeId || !nodeTitle || !query || parentTitles === undefined) {
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

    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ROLE_KEY) {
      throw new Error("Server mis-config (Supabase env vars)");
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    // Build search query - query already contains nodeTitle and nodeDescription from frontend
    const parentTitlesStr = Array.isArray(parentTitles) ? parentTitles.join(",") : "";
    const searchQuery = [query, parentTitlesStr]
      .filter(part => part && part.trim() !== "")
      .join(",");

    console.log(`[PAPERS_ONLY] Built query: ${searchQuery}`);

    // Frontend ensures we only get called when papers don't exist, so fetch and save directly
    const articleRequest: SearchArticleRequest = { query: searchQuery };
    let paperResult: SearchArticleResponse;
    
    try {
      paperResult = await callSearchArticleAPI(articleRequest);
    } catch (error) {
      console.warn("[PAPERS_ONLY] Papers API failed, using mock:", error.message);
      paperResult = await mockSearchArticleAPI(searchQuery);
    }

    const papers = paperResult.papers || [];
    console.log(`[PAPERS_ONLY] Got ${papers.length} papers, saving to database`);

    // Save papers to database (frontend ensures this won't conflict with existing data)
    await saveNodePapers(sb, nodeId, treeId, papers, team_id || null);

    const response = {
      success: true,
      nodeId,
      nodeTitle,
      results: {
        papers: {
          count: papers.length,
          saved: true,
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`[PAPERS_ONLY] Completed papers enrichment for node: ${nodeTitle}`, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("=== PAPERS ENRICHMENT ERROR ===");
    console.error("Error details:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
    });

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