import { PathLevel } from "@/types/tree";
import { PathState } from "../state/usePathState";
import { clearPathFromLevel, autoSelectChildren } from "../utils/pathUtils";
import { callNodeEnrichmentStreaming, buildParentTitles, getNodeDetails, isNodeLoading, hasNodeEnrichedData, StreamingResponse } from "@/services/nodeEnrichmentService";
import { triggerEnrichmentRefresh, triggerEnrichmentStart } from "@/hooks/useEnrichedData";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useLocation } from "react-router-dom";

export const useNodeClickHandler = (
  disableAutoSelection: boolean,
  treeData: any,
  initialPath: PathState,
  setSelectedPath: (updater: (prev: PathState) => PathState) => void,
  setHasUserMadeSelection: (value: boolean) => void,
  setUserClickedNode: (node: { level: PathLevel; nodeId: string } | null) => void
) => {
  const { userDetails } = useUserDetail();
  const location = useLocation();
  const locationState = location.state as {
    treeId?: string;
    query?: string;
  } | null;  const handleNodeClick = async (level: PathLevel, nodeId: string) => {
    console.log("Node clicked:", { level, nodeId, disableAutoSelection });
    setHasUserMadeSelection(true);

    // Track the user's actual click for sidebar display
    setUserClickedNode({ level, nodeId });

    // Check if we should proceed with enrichment
    if (locationState?.treeId && userDetails?.team_id && treeData) {
      // Check if node is already loading (same logic for all levels)
      const isIndividuallyLoading = isNodeLoading(nodeId);

      if (isIndividuallyLoading) {
        console.log('[NODE_ENRICHMENT] Node already loading, skipping:', {
          nodeId,
          level,
          isIndividuallyLoading
        });
        // Still update the UI selection but don't call API
      } else {
        // Immediately signal that enrichment might start for this node (for loading UI)
        triggerEnrichmentStart(nodeId);

        // Check if node already has data (same logic for all levels)
        hasNodeEnrichedData(nodeId).then((hasData) => {
          if (hasData) {
            console.log('[NODE_ENRICHMENT] Node already has complete data (both papers and use cases), skipping API call:', nodeId);
            // Just trigger refresh to show existing data (this will turn off loading)
            triggerEnrichmentRefresh(nodeId);
          } else {
            // Start enrichment process in background
            console.log('[NODE_ENRICHMENT] Starting enrichment for node (may have partial data):', nodeId);

            // Get node details from the tree data
            const { title: nodeTitle, description: nodeDescription } = getNodeDetails(level, nodeId, initialPath, treeData);
            console.log('[NODE_ENRICHMENT] Extracted node details:', { nodeTitle, nodeDescription });

            // Build parent titles array - simplified to empty array for now
            const parentTitles = buildParentTitles(level, nodeId, initialPath, treeData);
            console.log('[NODE_ENRICHMENT] Built parent titles:', parentTitles);

            // Build query parameter (combining search theme + node title + description)
            const searchTheme = locationState.query || '';
            const query = [searchTheme, nodeTitle, nodeDescription]
              .filter(Boolean)
              .join(', ');

            // Call the streaming enrichment API (non-blocking)
            callNodeEnrichmentStreaming({
              nodeId,
              treeId: locationState.treeId,
              nodeTitle,
              nodeDescription,
              query,
              parentTitles,
              team_id: userDetails.team_id
            }, (response: StreamingResponse) => {
              console.log('[NODE_ENRICHMENT_STREAMING] Received response:', response);

              if (response.type === 'papers') {
                console.log('[NODE_ENRICHMENT_STREAMING] Papers received - triggering refresh');
                triggerEnrichmentRefresh(nodeId);
              } else if (response.type === 'useCases') {
                console.log('[NODE_ENRICHMENT_STREAMING] Use cases received - triggering refresh');
                triggerEnrichmentRefresh(nodeId);
              } else if (response.type === 'complete') {
                console.log('[NODE_ENRICHMENT_STREAMING] Enrichment complete');
                triggerEnrichmentRefresh(nodeId);
              } else if (response.type === 'error') {
                console.warn('[NODE_ENRICHMENT_STREAMING] Enrichment error:', response.error);
              }
            }).catch((error) => {
              console.error('[NODE_ENRICHMENT_STREAMING] Error during streaming enrichment:', error);
            });
          }
        });
      }
    } else {
      console.log('[NODE_ENRICHMENT] Skipping enrichment - missing required context:', {
        hasTreeId: !!locationState?.treeId,
        hasTeamId: !!userDetails?.team_id,
        hasTreeData: !!treeData
      });
    }

    setSelectedPath((prev) => {
      if (prev[level] === nodeId) {
        // Clear the selected level and all subsequent levels
        return clearPathFromLevel(prev, level);
      }

      // MINDMAP MODE: Set only the selected level without auto-selection
      if (disableAutoSelection) {
        console.log("Mindmap mode: Setting selected node for", level, nodeId);
        const newPath = { ...prev };
        newPath[level] = nodeId;
        return newPath;
      }

      // TREEMAP MODE: Auto-selection enabled
      console.log("Treemap mode: Auto-selection enabled for", level, nodeId);
      const newPath = { ...prev };

      // Clear current and all subsequent levels
      const clearedPath = clearPathFromLevel(newPath, level);

      // Set the selected level
      clearedPath[level] = nodeId;

      // Auto-select children
      return autoSelectChildren(clearedPath, level, nodeId, treeData);
    });
  };

  return { handleNodeClick };
};
