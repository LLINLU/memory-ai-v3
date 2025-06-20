import { supabase } from "@/integrations/supabase/client";

// Global state to track loading nodes and prevent duplicate calls
const loadingNodes = new Set<string>();
const loadingPapers = new Set<string>();
const loadingUseCases = new Set<string>();
const enrichedNodes = new Set<string>();

export interface NodeEnrichmentRequest {
  nodeId: string;
  treeId: string;
  nodeTitle: string;
  nodeDescription?: string;
  query: string;
  parentTitles: string[];
  team_id?: string | null;
}

export interface NodeEnrichmentResponse {
  success: boolean;
  message?: string;
  enrichedData?: {
    papers: any[];
    useCases: any[];
  };
}

export interface StreamingResponse {
  type: 'papers' | 'useCases' | 'complete' | 'error';
  data?: any;
  error?: string;
  nodeId: string;
  timestamp: string;
}

export type StreamingCallback = (response: StreamingResponse) => void;

/**
 * Check if a node is currently being enriched
 */
export const isNodeLoading = (nodeId: string): boolean => {
  return loadingNodes.has(nodeId);
};

/**
 * Check if papers are currently being loaded for a node
 */
export const isPapersLoading = (nodeId: string): boolean => {
  return loadingPapers.has(nodeId);
};

/**
 * Check if use cases are currently being loaded for a node
 */
export const isUseCasesLoading = (nodeId: string): boolean => {
  return loadingUseCases.has(nodeId);
};

/**
 * Check if a node already has BOTH papers AND use cases (complete enriched data)
 * Returns true only if both types exist - if only one type exists, enrichment should still run
 */
export const hasNodeEnrichedData = async (nodeId: string): Promise<boolean> => {
  try {
    // First check our in-memory cache
    if (enrichedNodes.has(nodeId)) {
      return true;
    }

    // Check database for existing data
    const [papersResult, useCasesResult] = await Promise.all([
      supabase.from('node_papers').select('id').eq('node_id', nodeId).limit(1),
      supabase.from('node_use_cases').select('id').eq('node_id', nodeId).limit(1)
    ]);

    const hasCompleteData = (papersResult.data && papersResult.data.length > 0) && 
                           (useCasesResult.data && useCasesResult.data.length > 0);

    if (hasCompleteData) {
      enrichedNodes.add(nodeId);
    }

    return hasCompleteData;
  } catch (error) {
    console.error('[NODE_ENRICHMENT] Error checking existing data:', error);
    return false;
  }
};

/**
 * Call the node enrichment edge function with streaming support
 */
export const callNodeEnrichmentStreaming = async (
  params: NodeEnrichmentRequest,
  callback: StreamingCallback
): Promise<void> => {
  const { nodeId } = params;

  // Check if already loading
  if (loadingNodes.has(nodeId)) {
    console.log('[NODE_ENRICHMENT_STREAMING] Node already being processed:', nodeId);
    callback({
      type: 'error',
      error: 'Node enrichment already in progress',
      nodeId,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Mark as loading
  loadingNodes.add(nodeId);

  try {
    console.log('[NODE_ENRICHMENT_STREAMING] Starting selective enrichment for:', nodeId);

    // Check what data already exists
    const [papersExist, useCasesExist] = await Promise.all([
      checkPapersExist(nodeId),
      checkUseCasesExist(nodeId)
    ]);

    console.log(`[NODE_ENRICHMENT_STREAMING] Data check for ${nodeId}:`, {
      papersExist,
      useCasesExist
    });

    // Only call APIs for data that doesn't exist yet
    const promises: Promise<void>[] = [];
    
    if (!papersExist) {
      console.log('[NODE_ENRICHMENT_STREAMING] Papers missing, calling papers API');
      loadingPapers.add(nodeId); // Mark papers as loading
      
      // Import and trigger papers start event for sidebar
      import('@/hooks/useEnrichedData').then(({ triggerPapersStart }) => {
        triggerPapersStart(nodeId);
      });
      
      promises.push(callPapersEnrichment(params, callback));
    } else {
      console.log('[NODE_ENRICHMENT_STREAMING] Papers already exist, skipping papers API');
    }

    if (!useCasesExist) {
      console.log('[NODE_ENRICHMENT_STREAMING] Use cases missing, calling use cases API');
      loadingUseCases.add(nodeId); // Mark use cases as loading
      
      // Import and trigger use cases start event for sidebar
      import('@/hooks/useEnrichedData').then(({ triggerUseCasesStart }) => {
        triggerUseCasesStart(nodeId);
      });
      
      promises.push(callUseCasesEnrichment(params, callback));
    } else {
      console.log('[NODE_ENRICHMENT_STREAMING] Use cases already exist, skipping use cases API');
    }

    // If both already exist, trigger completion immediately
    if (promises.length === 0) {
      console.log('[NODE_ENRICHMENT_STREAMING] All data already exists, triggering completion');
      callback({
        type: 'complete',
        nodeId,
        timestamp: new Date().toISOString()
      });
      enrichedNodes.add(nodeId);
      return;
    }

    // Wait for any missing data to be fetched
    await Promise.allSettled(promises);

    console.log('[NODE_ENRICHMENT_STREAMING] All missing data processed');
    
    // Add a small delay to ensure all callbacks have been processed
    setTimeout(() => {
      console.log('[NODE_ENRICHMENT_STREAMING] Triggering final completion callback');
      callback({
        type: 'complete',
        nodeId,
        timestamp: new Date().toISOString()
      });
    }, 100);

    // Mark as enriched when complete
    enrichedNodes.add(nodeId);
  } catch (error) {
    console.error('[NODE_ENRICHMENT_STREAMING] Error:', error);
    callback({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      nodeId,
      timestamp: new Date().toISOString()
    });
  } finally {
    // Always remove from loading set
    loadingNodes.delete(nodeId);
  }
};

// Helper function to check if papers exist for a node
const checkPapersExist = async (nodeId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from("node_papers")
      .select("id", { count: "exact", head: true })
      .eq("node_id", nodeId);

    if (error) {
      console.warn(`[CHECK_PAPERS] Error checking papers for ${nodeId}:`, error);
      return false;
    }

    return (count ?? 0) > 0;
  } catch (error) {
    console.error('[CHECK_PAPERS] Error:', error);
    return false;
  }
};

// Helper function to check if use cases exist for a node
const checkUseCasesExist = async (nodeId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from("node_use_cases")
      .select("id", { count: "exact", head: true })
      .eq("node_id", nodeId);

    if (error) {
      console.warn(`[CHECK_USECASES] Error checking use cases for ${nodeId}:`, error);
      return false;
    }

    return (count ?? 0) > 0;
  } catch (error) {
    console.error('[CHECK_USECASES] Error:', error);
    return false;
  }
};

// Helper function to enrich papers using dedicated papers endpoint
const callPapersEnrichment = async (
  params: NodeEnrichmentRequest,
  callback: StreamingCallback
): Promise<void> => {
  const { nodeId } = params;
  
  try {
    console.log('[PAPERS_ENRICHMENT] Starting papers enrichment for:', nodeId);
    
    const { data, error } = await supabase.functions.invoke('node-enrichment-papers', {
      body: params
    });

    if (error) {
      console.error('[PAPERS_ENRICHMENT] Papers enrichment error:', error);
      callback({
        type: 'error',
        error: `Papers enrichment failed: ${error.message}`,
        nodeId,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (data?.results?.papers?.saved) {
      console.log('[PAPERS_ENRICHMENT] Papers saved successfully, triggering callback');
      callback({
        type: 'papers',
        data: { count: data.results.papers.count },
        nodeId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('[PAPERS_ENRICHMENT] Papers response received but not triggering callback:', {
        hasResults: !!data?.results,
        hasPapers: !!data?.results?.papers,
        papersSaved: data?.results?.papers?.saved,
        papersCount: data?.results?.papers?.count,
        fullData: data
      });
    }
  } catch (error) {
    console.error('[PAPERS_ENRICHMENT] Error:', error);
    callback({
      type: 'error',
      error: `Papers enrichment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      nodeId,
      timestamp: new Date().toISOString()
    });
  } finally {
    // Always remove papers loading state
    loadingPapers.delete(nodeId);
  }
};

// Helper function to enrich use cases using dedicated use cases endpoint
const callUseCasesEnrichment = async (
  params: NodeEnrichmentRequest,
  callback: StreamingCallback
): Promise<void> => {
  const { nodeId } = params;
  
  try {
    console.log('[USECASES_ENRICHMENT] Starting use cases enrichment for:', nodeId);
    
    const { data, error } = await supabase.functions.invoke('node-enrichment-usecases', {
      body: params
    });

    if (error) {
      console.error('[USECASES_ENRICHMENT] Use cases enrichment error:', error);
      callback({
        type: 'error',
        error: `Use cases enrichment failed: ${error.message}`,
        nodeId,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (data?.results?.useCases?.saved) {
      console.log('[USECASES_ENRICHMENT] Use cases saved successfully, triggering callback');
      callback({
        type: 'useCases',
        data: { count: data.results.useCases.count },
        nodeId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('[USECASES_ENRICHMENT] Use cases response received but not triggering callback:', {
        hasResults: !!data?.results,
        hasUseCases: !!data?.results?.useCases,
        useCasesSaved: data?.results?.useCases?.saved,
        useCasesCount: data?.results?.useCases?.count,
        fullData: data
      });
    }
  } catch (error) {
    console.error('[USECASES_ENRICHMENT] Error:', error);
    callback({
      type: 'error',
      error: `Use cases enrichment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      nodeId,
      timestamp: new Date().toISOString()
    });
  } finally {
    // Always remove use cases loading state
    loadingUseCases.delete(nodeId);
  }
};

/**
 * Call the node enrichment edge function when a node is clicked (traditional approach)
 */
export const callNodeEnrichment = async (
  params: NodeEnrichmentRequest
): Promise<NodeEnrichmentResponse> => {
  const { nodeId } = params;

  // Check if already loading or already has data
  if (loadingNodes.has(nodeId)) {
    console.log('[NODE_ENRICHMENT] Node already being processed:', nodeId);
    return {
      success: false,
      message: 'Node enrichment already in progress'
    };
  }

  // Check if node already has enriched data
  const hasExistingData = await hasNodeEnrichedData(nodeId);
  if (hasExistingData) {
    console.log('[NODE_ENRICHMENT] Node already has enriched data:', nodeId);
    return {
      success: true,
      message: 'Node already has enriched data'
    };
  }

  // Mark as loading
  loadingNodes.add(nodeId);

  try {
    console.log('[NODE_ENRICHMENT] Calling enrichment API with params:', {
      nodeId: params.nodeId,
      treeId: params.treeId,
      team_id: params.team_id,
      nodeTitle: params.nodeTitle,
      parentTitlesCount: params.parentTitles.length,
      query: params.query
    });

    const { data, error } = await supabase.functions.invoke('node-enrichment', {
      body: params
    });

    if (error) {
      console.error('[NODE_ENRICHMENT] Edge function error:', error);
      throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('No data returned from Edge Function');
    }

    console.log('[NODE_ENRICHMENT] Enrichment API response:', {
      success: data.success,
      hasEnrichedData: !!data.enrichedData,
      papersCount: data.enrichedData?.papers?.length || 0,
      useCasesCount: data.enrichedData?.useCases?.length || 0
    });

    // Mark as enriched if successful
    if (data.success) {
      enrichedNodes.add(nodeId);
    }

    return data as NodeEnrichmentResponse;
  } catch (error) {
    console.error('[NODE_ENRICHMENT] Error calling enrichment API:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  } finally {
    // Always remove from loading set
    loadingNodes.delete(nodeId);
  }
};

/**
 * Build parent titles array - simplified to return empty array for now
 */
export const buildParentTitles = (
  level: string,
  nodeId: string,
  selectedPath: any,
  treeData: any
): string[] => {
  console.log('[PARENT_TITLES] Simplified - returning empty array for now');
  return [];
};

/**
 * Get node details (title and description) from the tree data
 */
export const getNodeDetails = (
  level: string,
  nodeId: string,
  selectedPath: any,
  treeData: any
): { title: string; description: string } => {
  try {
    let nodeTitle = '';
    let nodeDescription = '';
    
    console.log('[NODE_ENRICHMENT] Getting node details for:', {
      level,
      nodeId,
      selectedPath,
      treeDataKeys: Object.keys(treeData || {})
    });
    
    if (level === 'level1') {
      // Level 1 nodes are in treeData.level1Items array
      const node = treeData?.level1Items?.find((item: any) => item.id === nodeId);
      nodeTitle = node?.name || '';
      nodeDescription = node?.description || '';
      console.log('[NODE_ENRICHMENT] Found level1 node:', { 
        level1ItemsCount: treeData?.level1Items?.length || 0,
        searchingForId: nodeId,
        node, 
        nodeTitle, 
        nodeDescription 
      });
    } else {
      // Level 2+ nodes are in treeData.levelXItems[parentId] arrays
      const levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9', 'level10'];
      const targetLevelIndex = levels.indexOf(level);
      
      if (targetLevelIndex > 0) {
        const parentLevel = levels[targetLevelIndex - 1];
        const parentNodeId = selectedPath[parentLevel];
        const levelKey = `${level}Items`;
        
        console.log('[NODE_ENRICHMENT] Looking for node in:', {
          parentLevel,
          parentNodeId,
          levelKey,
          hasLevelData: !!treeData?.[levelKey],
          hasParentData: !!treeData?.[levelKey]?.[parentNodeId],
          allParentKeys: treeData?.[levelKey] ? Object.keys(treeData[levelKey]) : []
        });
        
        // Look in the parent's children array
        const parentItems = treeData?.[levelKey]?.[parentNodeId] || [];
        const node = parentItems.find((item: any) => item.id === nodeId);
        nodeTitle = node?.name || '';
        nodeDescription = node?.description || '';
        
        console.log('[NODE_ENRICHMENT] Found node in parent children:', { 
          parentItems: parentItems.length,
          parentItemIds: parentItems.map((item: any) => ({ id: item.id, name: item.name })),
          searchingForId: nodeId,
          node, 
          nodeTitle, 
          nodeDescription 
        });

        // If not found in expected parent, let's search all parents for this level
        if (!node && treeData?.[levelKey]) {
          console.log('[NODE_ENRICHMENT] Node not found in expected parent, searching all parents...');
          for (const [parentId, items] of Object.entries(treeData[levelKey])) {
            if (Array.isArray(items)) {
              const foundNode = items.find((item: any) => item.id === nodeId);
              if (foundNode) {
                console.log('[NODE_ENRICHMENT] Found node in different parent:', {
                  expectedParent: parentNodeId,
                  actualParent: parentId,
                  foundNode
                });
                nodeTitle = foundNode.name || '';
                nodeDescription = foundNode.description || '';
                break;
              }
            }
          }
        }
        
        // If still not found, fall back to comprehensive search
        if (!nodeTitle && !nodeDescription) {
          console.log('[NODE_ENRICHMENT] Comprehensive search for node:', nodeId);
          
          // Search through all levels to find this node
          const allLevelKeys = ['level1Items', 'level2Items', 'level3Items', 'level4Items', 'level5Items', 'level6Items', 'level7Items', 'level8Items', 'level9Items', 'level10Items'];
          
          for (const levelKey of allLevelKeys) {
            if (!treeData?.[levelKey]) continue;
            
            if (levelKey === 'level1Items') {
              // Level 1 is an array
              const foundNode = treeData[levelKey].find((item: any) => item.id === nodeId);
              if (foundNode) {
                nodeTitle = foundNode.name || '';
                nodeDescription = foundNode.description || '';
                console.log('[NODE_ENRICHMENT] Found node in comprehensive search - level1:', foundNode);
                break;
              }
            } else {
              // Other levels are objects with parent keys
              for (const [parentId, items] of Object.entries(treeData[levelKey])) {
                if (Array.isArray(items)) {
                  const foundNode = items.find((item: any) => item.id === nodeId);
                  if (foundNode) {
                    nodeTitle = foundNode.name || '';
                    nodeDescription = foundNode.description || '';
                    console.log(`[NODE_ENRICHMENT] Found node in comprehensive search - ${levelKey}:`, foundNode);
                    break;
                  }
                }
              }
              if (nodeTitle) break;
            }
          }
        }
      }
    }

    console.log('[NODE_ENRICHMENT] Final node details:', {
      level,
      nodeId,
      nodeTitle,
      nodeDescription
    });

    return { title: nodeTitle, description: nodeDescription };
  } catch (error) {
    console.error('[NODE_ENRICHMENT] Error getting node details:', error);
    return { title: '', description: '' };
  }
};
