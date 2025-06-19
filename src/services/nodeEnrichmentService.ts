import { supabase } from "@/integrations/supabase/client";

// Global state to track loading nodes and prevent duplicate calls
const loadingNodes = new Set<string>();
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

/**
 * Check if a node is currently being enriched
 */
export const isNodeLoading = (nodeId: string): boolean => {
  return loadingNodes.has(nodeId);
};

/**
 * Check if a node already has enriched data
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

    const hasData = (papersResult.data && papersResult.data.length > 0) || 
                   (useCasesResult.data && useCasesResult.data.length > 0);

    if (hasData) {
      enrichedNodes.add(nodeId);
    }

    return hasData;
  } catch (error) {
    console.error('[NODE_ENRICHMENT] Error checking existing data:', error);
    return false;
  }
};

/**
 * Call the node enrichment edge function when a node is clicked
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
