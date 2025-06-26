// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface NodeEnrichmentRequest {
  nodeId: string;
  treeId: string;
  enrichNode: string;
  query: string;
  parentNodes: string[];
  team_id?: string | null;
  treeType: string;
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

// Build sophisticated query based on tree type and parent nodes
function buildEnrichmentQuery(enrichNode: string, query: string, parentNodes: string[], treeType: string): string {
  // Create the full hierarchy by adding enrichNode to the end of parentNodes
  const fullHierarchy = [...parentNodes, enrichNode];
  const hierarchyLength = fullHierarchy.length;
  
  if (treeType.toLowerCase() === "ted") {
    // TED generation query format for use cases
    let queryParts = [`We want to find Implementation in ${query}`];
    
    if (hierarchyLength >= 1) {
      queryParts.push(`tackling ${fullHierarchy[0]}`); // Scenario
    }
    if (hierarchyLength >= 2) {
      queryParts.push(`that aims for ${fullHierarchy[1]}`); // Purpose
    }
    if (hierarchyLength >= 3) {
      queryParts.push(`by using ${fullHierarchy[2]}`); // Function
    }
    if (hierarchyLength >= 4) {
      queryParts.push(`such as ${fullHierarchy[3]}`); // Measure
    }
    if (hierarchyLength >= 5) {
      queryParts.push(`especially ${fullHierarchy[4]}`); // Measure2/3/4/5
    }
    
    return queryParts.join(" / ");
  } else if (treeType.toLowerCase() === "fast") {
    // Fast generation query format for use cases
    let queryParts = [`We want to find Market Implementation by breaking down the ${query}`];
    
    if (hierarchyLength >= 1) {
      queryParts.push(`into ${fullHierarchy[0]}`); // How1
    }
    if (hierarchyLength >= 2) {
      queryParts.push(`focusing on ${fullHierarchy[1]}`); // How2
    }
    if (hierarchyLength >= 3) {
      queryParts.push(`especially in ${fullHierarchy[2]}`); // How3
    }
    if (hierarchyLength >= 4) {
      queryParts.push(`especially in ${fullHierarchy[3]}`); // How4
    }
    if (hierarchyLength >= 5) {
      queryParts.push(`especially in ${fullHierarchy[4]}`); // How5
    }
    
    return queryParts.join(" / ");
  }
  
  // Fallback to simple query if tree type is not recognized
  return `${query} ${parentNodes.join(" ")} ${enrichNode}`;
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
  // Always handle CORS first
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: CORS });
  }

  try {
    console.log(`[USECASES_ONLY] Function started, method: ${req.method}`);
    
    const requestBody = await req.json();
    console.log(`[USECASES_ONLY] Received request for use cases enrichment`);

    const {
      nodeId,
      treeId,
      enrichNode,
      query,
      parentNodes,
      team_id,
      treeType,
    } = requestBody as NodeEnrichmentRequest;

    // Validate required parameters
    if (!nodeId || !treeId || !enrichNode || !query || parentNodes === undefined || !treeType) {
      console.error(`[USECASES_ONLY] Missing required parameters:`, {
        hasNodeId: !!nodeId,
        hasTreeId: !!treeId,
        hasEnrichNode: !!enrichNode,
        hasQuery: !!query,
        hasParentNodes: parentNodes !== undefined,
        hasTreeType: !!treeType
      });
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
          required: ["nodeId", "treeId", "enrichNode", "query", "parentNodes", "treeType"],
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
      console.error(`[USECASES_ONLY] Missing Supabase environment variables`);
      throw new Error("Server mis-config (Supabase env vars)");
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY);

    // Build sophisticated search query based on tree type and parent nodes
    const searchQuery = buildEnrichmentQuery(enrichNode, query, parentNodes, treeType);

    console.log(`[USECASES_ONLY] Built query: ${searchQuery}`);    // Frontend ensures we only get called when use cases don't exist, so fetch and save directly
    const marketImplRequest: SearchMarketImplRequest = { query: searchQuery };
    let useCaseResult: SearchMarketImplResponse;
    
    try {
      useCaseResult = await callSearchMarketImplAPI(marketImplRequest);
    } catch (error) {
      console.error("[USECASES_ONLY] Use cases API failed:", error.message);
      throw new Error(`Use Cases API failed: ${error.message}`);
    }

    const useCases = useCaseResult.use_cases || [];
    console.log(`[USECASES_ONLY] Got ${useCases.length} use cases, saving to database`);

    // Save use cases to database (frontend ensures this won't conflict with existing data)
    await saveNodeUseCases(sb, nodeId, treeId, useCases, team_id || null);

    const response = {
      success: true,
      nodeId,
      enrichNode,
      results: {
        useCases: {
          count: useCases.length,
          saved: true,
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`[USECASES_ONLY] Completed use cases enrichment for node: ${enrichNode}`, response);

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