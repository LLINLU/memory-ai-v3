// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface NodeEnrichmentRequest {
  nodeId: string;
  treeId: string;
  nodeTitle: string;
  nodeDescription?: string;
  query: string;
  parentTitles: string[];
  team_id?: string | null;
}

interface UseCase {
  id: string;
  product: string;
  company: string[];
  description: string;
  press_releases: string[];
}

interface SearchMarketImplRequest {
  query: string;
}

interface SearchMarketImplResponse {
  use_cases: UseCase[];
  total_count: number;
}

// Basic-Auth helper for production APIs
function makeBasicAuthHeader(): string {
  const user = Deno.env.get("SEARCH_API_USER") ?? "admin";
  const pass = Deno.env.get("SEARCH_API_PASS") ?? "adminpassword";
  return "Basic " + btoa(`${user}:${pass}`);
}

// Call search_market_impl API for use cases
async function callSearchMarketImplAPI(request: SearchMarketImplRequest): Promise<SearchMarketImplResponse> {
  console.log(`[USECASES_ONLY] Calling search_market_impl API with query: ${request.query}`);

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
    console.error(`[USECASES_ONLY] API call failed with status ${res.status}:`, text);
    throw new Error(`search_market_impl API ${res.status}: ${text}`);
  }

  const responseText = await res.text();
  console.log("[USECASES_ONLY] Raw API response:", responseText);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error("[USECASES_ONLY] JSON parsing failed:", e.message);
    responseData = { use_cases: [], total_count: 0 };
  }

  if (Array.isArray(responseData)) {
    responseData = {
      use_cases: responseData,
      total_count: responseData.length,
    };
  }

  console.log(`[USECASES_ONLY] Received ${responseData.use_cases?.length || 0} use cases`);
  return responseData;
}

// Mock search_market_impl API for fallback
async function mockSearchMarketImplAPI(query: string): Promise<SearchMarketImplResponse> {
  console.log(`[USECASES_ONLY] Generating mock use cases for query: ${query}`);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const useCaseCount = Math.floor(Math.random() * 3) + 1;
  const useCases: UseCase[] = [];

  for (let i = 0; i < useCaseCount; i++) {
    const useCaseId = crypto.randomUUID();
    useCases.push({
      id: useCaseId,
      product: `${query} Solution ${i + 1}`,
      company: ["Mock Company"],
      description: `Real-world implementation of ${query.toLowerCase()} technology.`,
      press_releases: [`${query} Implementation News ${i + 1}`],
    });
  }

  return { use_cases: useCases, total_count: useCases.length };
}

// Save use cases for a specific node
async function saveNodeUseCases(
  supabaseClient: any,
  nodeId: string,
  treeId: string,
  useCases: UseCase[],
  teamId: string | null
): Promise<void> {
  if (useCases.length === 0) return;

  // Delete existing use cases for this node
  const { error: deleteError } = await supabaseClient
    .from("node_use_cases")
    .delete()
    .eq("node_id", nodeId);

  if (deleteError) {
    console.warn(`[USECASES_ONLY] Failed to delete existing use cases for node ${nodeId}:`, deleteError);
  }

  for (const useCase of useCases) {
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
      console.error(`[USECASES_ONLY] Failed to save use case:`, useCaseError);
      throw new Error(`Failed to save use case for node ${nodeId}: ${useCaseError.message}`);
    }
  }

  console.log(`[USECASES_ONLY] Successfully saved ${useCases.length} use cases for node: ${nodeId}`);
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
    console.log(`[USECASES_ONLY] Received request for use cases enrichment`);

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

    console.log(`[USECASES_ONLY] Built query: ${searchQuery}`);

    // Frontend ensures we only get called when use cases don't exist, so fetch and save directly
    const marketImplRequest: SearchMarketImplRequest = { query: searchQuery };
    let useCaseResult: SearchMarketImplResponse;
    
    try {
      useCaseResult = await callSearchMarketImplAPI(marketImplRequest);
    } catch (error) {
      console.warn("[USECASES_ONLY] Use cases API failed, using mock:", error.message);
      useCaseResult = await mockSearchMarketImplAPI(searchQuery);
    }

    const useCases = useCaseResult.use_cases || [];
    console.log(`[USECASES_ONLY] Got ${useCases.length} use cases, saving to database`);

    // Save use cases to database (frontend ensures this won't conflict with existing data)
    await saveNodeUseCases(sb, nodeId, treeId, useCases, team_id || null);

    const response = {
      success: true,
      nodeId,
      nodeTitle,
      results: {
        useCases: {
          count: useCases.length,
          saved: true,
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`[USECASES_ONLY] Completed use cases enrichment for node: ${nodeTitle}`, response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("=== USE CASES ENRICHMENT ERROR ===");
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