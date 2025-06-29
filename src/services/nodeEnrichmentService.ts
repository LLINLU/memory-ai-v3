
import { supabase } from "@/integrations/supabase/client";
import { enqueueEnrichment } from "./enrichmentQueue";

// Global state to track loading nodes and prevent duplicate calls
const loadingNodes = new Set<string>();
const loadingPapers = new Set<string>();
const loadingUseCases = new Set<string>();
const enrichedNodes = new Set<string>();

export interface NodeEnrichmentRequest {
  nodeId: string;
  treeId: string;
  enrichNode: string;
  query: string;
  parentNodes: NodeInfo[];
  team_id?: string | null;
  treeType: string;
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


export interface NodeInfo {
  name: string; description: string; level: string;
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
      supabase.from('node_papers').select('id').eq('node_id', nodeId).limit(20),
      supabase.from('node_use_cases').select('id').eq('node_id', nodeId).limit(20)
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

    return (count ?? 0) > 10;
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
  const { nodeId, enrichNode } = params;

  console.log('[PAPERS_ENRICHMENT] Queueing papers enrichment for:', nodeId);

  // Use the queue system instead of direct API call
  enqueueEnrichment(nodeId, enrichNode, 'papers', params, (response) => {
    console.log('[PAPERS_ENRICHMENT] Queue response:', {
      nodeId,
      type: response.type,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      savedField: response.data?.saved,
      countField: response.data?.count,
      fullResponse: response
    });

    if (response.type === 'error') {
      console.error('[PAPERS_ENRICHMENT] Papers enrichment error:', response.error);
      callback(response);
    } else {
      // Consider it successful if we got any data back (the API call succeeded)
      // The presence of data means the enrichment process completed
      console.log('[PAPERS_ENRICHMENT] Papers enrichment completed, triggering callback');
      callback({
        type: 'papers',
        data: {
          count: response.data?.count || 0,
          saved: response.data?.saved || false,
          response: response.data
        },
        nodeId,
        timestamp: new Date().toISOString()
      });
    }

    // Always remove papers loading state when done
    loadingPapers.delete(nodeId);
  });
};

// Helper function to enrich use cases using dedicated use cases endpoint
const callUseCasesEnrichment = async (
  params: NodeEnrichmentRequest,
  callback: StreamingCallback
): Promise<void> => {
  const { nodeId, enrichNode } = params;

  console.log('[USECASES_ENRICHMENT] Queueing use cases enrichment for:', nodeId);

  // Use the queue system instead of direct API call
  enqueueEnrichment(nodeId, enrichNode, 'useCases', params, (response) => {
    console.log('[USECASES_ENRICHMENT] Queue response:', {
      nodeId,
      type: response.type,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      savedField: response.data?.saved,
      countField: response.data?.count,
      fullResponse: response
    });

    if (response.type === 'error') {
      console.error('[USECASES_ENRICHMENT] Use cases enrichment error:', response.error);
      callback(response);
    } else {
      // Consider it successful if we got any data back (the API call succeeded)
      // The presence of data means the enrichment process completed
      console.log('[USECASES_ENRICHMENT] Use cases enrichment completed, triggering callback');
      callback({
        type: 'useCases',
        data: {
          count: response.data?.count || 0,
          saved: response.data?.saved || false,
          response: response.data
        },
        nodeId,
        timestamp: new Date().toISOString()
      });
    }

    // Always remove use cases loading state when done
    loadingUseCases.delete(nodeId);
  });
};

/**
 * Build parent titles array based on the selected path and tree data
 * Maximum of 4 parent nodes are included (levels below level5 are excluded as per requirements)
 */
export const buildParentTitles = (
  level: string,
  nodeId: string,
  selectedPath: any,
  treeData: any
): string[] => {
  try {
    const parentTitles: string[] = [];
    const levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9', 'level10'];
    const targetLevelIndex = levels.indexOf(level);

    console.log('[PARENT_TITLES] Building parent titles for:', {
      level,
      nodeId,
      targetLevelIndex,
      selectedPath
    });

    // Build parent hierarchy up to the target level (excluding the current node)
    for (let i = 0; i < targetLevelIndex && i < 4; i++) { // Max 4 parents as per requirements
      const currentLevel = levels[i];
      const parentNodeId = selectedPath[currentLevel];

      if (!parentNodeId) {
        console.log(`[PARENT_TITLES] No parent node for ${currentLevel}, stopping`);
        break;
      }

      // Get the parent node title
      const parentTitle = getNodeTitle(currentLevel, parentNodeId, treeData);
      if (parentTitle) {
        parentTitles.push(parentTitle);
        console.log(`[PARENT_TITLES] Added parent ${i + 1}: ${parentTitle} (from ${currentLevel})`);
      } else {
        console.warn(`[PARENT_TITLES] Could not find title for ${currentLevel}: ${parentNodeId}`);
      }
    }

    console.log('[PARENT_TITLES] Final parent titles:', parentTitles);
    return parentTitles;
  } catch (error) {
    console.error('[PARENT_TITLES] Error building parent titles:', error);
    return [];
  }
};


export const buildParentInfo = (
  treeMode: string,
  level: string,
  nodeId: string,
  selectedPath: any,
  treeData: any
): NodeInfo[] => {

  try {
    const parentNodes: NodeInfo[] = [];
    const levels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9', 'level10'];
    const targetLevelIndex = levels.indexOf(level);

    console.log('[PARENT_TITLES] Building parent titles for:', {
      level,
      nodeId,
      targetLevelIndex,
      selectedPath
    });
    console.log("[PARENT_SELECTED_PATH]", selectedPath);
    // Build parent hierarchy up to the target level (excluding the current node)
    for (let i = 0; i < targetLevelIndex && i < 4; i++) { // Max 4 parents as per requirements
      const currentLevel = levels[i];
      const parentNodeId = selectedPath[currentLevel];

      if (!parentNodeId) {
        console.log(`[PARENT_TITLES] No parent node for ${currentLevel}, stopping`);
        break;
      }

      // Get the parent node title
      const parentNode = getNodeInfo(treeMode, currentLevel, parentNodeId, treeData);
      if (parentNode) {
        parentNodes.push(parentNode);
        console.log(`[PARENT_TITLES] Added parent ${i + 1}: ${parentNodes} (from ${currentLevel})`);
      } else {
        console.warn(`[PARENT_TITLES] Could not find title for ${currentLevel}: ${parentNodeId}`);
      }
    }

    console.log('[PARENT_TITLES] Final parent titles:', parentNodes);
    return parentNodes;
  } catch (error) {
    console.error('[PARENT_TITLES] Error building parent titles:', error);
    return [];
  }
};

/**
 * Helper function to get node title from tree data
 */
const getNodeTitle = (level: string, nodeId: string, treeData: any): string => {
  try {
    if (level === 'level1') {
      // Level 1 nodes are in treeData.level1Items array
      const node = treeData?.level1Items?.find((item: any) => item.id === nodeId);
      return node?.name || '';
    } else {
      // Level 2+ nodes are in treeData.levelXItems[parentId] arrays
      const levelKey = `${level}Items`;

      // Search through all parent groups for this level
      if (treeData?.[levelKey]) {
        for (const [parentId, items] of Object.entries(treeData[levelKey])) {
          if (Array.isArray(items)) {
            const foundNode = items.find((item: any) => item.id === nodeId);
            if (foundNode) {
              return foundNode.name || '';
            }
          }
        }
      }
    }

    return '';
  } catch (error) {
    console.error(`[GET_NODE_TITLE] Error getting title for ${level}:${nodeId}:`, error);
    return '';
  }
};

const getNodeInfo = (treeMode:string, level: string, nodeId: string, treeData: any): NodeInfo | null  => {
  const labels = treeMode === "FAST" ?
    {
      "level1": 'How1',
      "level2": 'How2',
      "level3": 'How3',
      "level4": 'How4',
      "level5": 'How5',
      "level6": 'How6',
      "level7": 'How7',
      "level8": 'How8',
      "level9": 'How9',
      "level10": 'How10',
    }
  : treeMode === "TED" ?
    {
      "level1": 'シナリオ',
      "level2": '目的',
      "level3": '機能',
      "level4": '手段',
      "level5": '手段2',
      "level6": '手段3',
      "level7": '手段4',
      "level8": '手段5',
      "level9": '手段6',
      "level10":'手段7',

    }
     : []

  try {
    if (level === 'level1') {
      // Level 1 nodes are in treeData.level1Items array
      const node = treeData?.level1Items?.find((item: any) => item.id === nodeId);
      if (node) {
        return {name: node.name, description: node.description, level: labels[level]}
      }
      return null
    } else {
      // Level 2+ nodes are in treeData.levelXItems[parentId] arrays
      const levelKey = `${level}Items`;

      // Search through all parent groups for this level
      if (treeData?.[levelKey]) {
        for (const items of Object.values(treeData[levelKey])) {
          if (Array.isArray(items)) {
            const foundNode = items.find((item: any) => item.id === nodeId);
            if (foundNode) {
              return {name: foundNode.name, description: foundNode.description, level: labels[level]}
            }
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`[GET_NODE_TITLE] Error getting title for ${level}:${nodeId}:`, error);
    return null;
  }
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

/**
 * Create a properly formatted NodeEnrichmentRequest for the new API structure
 */
export const createEnrichmentRequest = (
  nodeId: string,
  treeId: string,
  level: string,
  selectedPath: any,
  treeData: any,
  query: string,
  treeType: string,
  team_id?: string | null
): NodeEnrichmentRequest => {
  try {
    // Get the node details (title will be used as enrichNode)
    const { title: enrichNode } = getNodeDetails(level, nodeId, selectedPath, treeData);

    // Build parent info array - use buildParentInfo instead of buildParentTitles
    const parentNodes = buildParentInfo(treeData?.mode || "TED", level, nodeId, selectedPath, treeData);

    console.log('[CREATE_ENRICHMENT_REQUEST] Created request:', {
      nodeId,
      treeId,
      enrichNode,
      parentNodes,
      query,
      treeType,
      team_id
    });

    return {
      nodeId,
      treeId,
      enrichNode,
      query,
      parentNodes,
      treeType,
      team_id
    };
  } catch (error) {
    console.error('[CREATE_ENRICHMENT_REQUEST] Error creating request:', error);
    throw error;
  }
};

/**
 * Enrich a node with the new API structure - main entry point for UI
 */
export const enrichNodeWithNewStructure = async (
  nodeId: string,
  treeId: string,
  level: string,
  selectedPath: any,
  treeData: any,
  query: string,
  treeType: string,
  callback: StreamingCallback,
  team_id?: string | null
): Promise<void> => {
  try {
    // Create the properly formatted request
    const enrichmentRequest = createEnrichmentRequest(
      nodeId,
      treeId,
      level,
      selectedPath,
      treeData,
      query,
      treeType,
      team_id
    );

    // Always use the new queue-based streaming approach
    await callNodeEnrichmentStreaming(enrichmentRequest, callback);
  } catch (error) {
    console.error('[ENRICH_NODE_NEW_STRUCTURE] Error:', error);
    callback({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      nodeId,
      timestamp: new Date().toISOString()
    });
  }
};
