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
 * Call the node enrichment edge function with streaming support
 */
export const callNodeEnrichmentStreaming = async (
  params: NodeEnrichmentRequest,
  callback: StreamingCallback
): Promise<void> => {
  const { nodeId } = params;

  // Check if already loading or already has data
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

  // Check if node already has enriched data
  const hasExistingData = await hasNodeEnrichedData(nodeId);
  if (hasExistingData) {
    console.log('[NODE_ENRICHMENT_STREAMING] Node already has enriched data:', nodeId);
    callback({
      type: 'complete',
      nodeId,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Mark as loading
  loadingNodes.add(nodeId);

  try {
    console.log('[NODE_ENRICHMENT_STREAMING] Starting streaming enrichment for:', nodeId);

    // Get the Supabase URL and anon key for direct fetch
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/node-enrichment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ...params,
        streaming: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              callback(data);
              
              // Mark as enriched when complete
              if (data.type === 'complete') {
                enrichedNodes.add(nodeId);
              }
            } catch (parseError) {
              console.error('[NODE_ENRICHMENT_STREAMING] Error parsing chunk:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
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
