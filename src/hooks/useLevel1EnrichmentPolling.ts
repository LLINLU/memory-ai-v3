import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { triggerEnrichmentRefresh } from "@/hooks/useEnrichedData";

interface Level1EnrichmentStatus {
  nodeId: string;
  hasStarted: boolean;
  hasPapers: boolean;
  hasUseCases: boolean;
  paperCount: number;
  useCaseCount: number;
}

interface Level1EnrichmentState {
  loadingNodes: Set<string>;
  enrichmentStatus: Map<string, Level1EnrichmentStatus>;
  isPolling: boolean;
}

// Global state for level 1 enrichment tracking
const level1EnrichmentState: Level1EnrichmentState = {
  loadingNodes: new Set(),
  enrichmentStatus: new Map(),
  isPolling: false,
};

// Debug flag for detailed logging (can be enabled in browser console)
// To enable: window.enableLevel1EnrichmentDebug = true
const isDebugEnabled = () => (window as any).enableLevel1EnrichmentDebug === true;

// Functions to check and update loading states
export const isLevel1Loading = (nodeId: string): boolean => {
  return level1EnrichmentState.loadingNodes.has(nodeId);
};

export const isLevel1PapersLoading = (nodeId: string): boolean => {
  const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
  
  // If no status exists, we need to check if this node should be loading
  // This can happen when TreeNode renders before polling initializes
  if (!status) {
    console.log(`[LEVEL1_PAPERS_CHECK] Node ${nodeId}: No status found, isPolling=${level1EnrichmentState.isPolling}, defaulting to not loading (will be fixed on next poll)`);
    return false; // Will be corrected when polling initializes
  }
  
  // Show loading if enrichment has started but no papers found yet (paperCount === 0)
  const isLoading = status.hasStarted && status.paperCount === 0;
  
  console.log(`[LEVEL1_PAPERS_CHECK] Node ${nodeId}: hasStarted=${status.hasStarted}, paperCount=${status.paperCount}, isLoading=${isLoading}`);
  
  return isLoading;
};

export const isLevel1UseCasesLoading = (nodeId: string): boolean => {
  const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
  
  // If no status exists, we need to check if this node should be loading
  // This can happen when TreeNode renders before polling initializes
  if (!status) {
    console.log(`[LEVEL1_USECASES_CHECK] Node ${nodeId}: No status found, isPolling=${level1EnrichmentState.isPolling}, defaulting to not loading (will be fixed on next poll)`);
    return false; // Will be corrected when polling initializes
  }
  
  // Show loading if enrichment has started but no use cases found yet (useCaseCount === 0)
  const isLoading = status.hasStarted && status.useCaseCount === 0;
  
  console.log(`[LEVEL1_USECASES_CHECK] Node ${nodeId}: hasStarted=${status.hasStarted}, useCaseCount=${status.useCaseCount}, isLoading=${isLoading}`);
  
  return isLoading;
};

// Function to check if a level 1 node has complete enrichment data
export const hasLevel1CompleteData = (nodeId: string): boolean => {
  const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
  return status?.hasPapers && status?.hasUseCases;
};

// Debug function to inspect current enrichment state (callable from console)
export const getLevel1EnrichmentState = () => {
  const statusArray = Array.from(level1EnrichmentState.enrichmentStatus.entries()).map(([nodeId, status]) => ({
    nodeId,
    ...status,
    isInLoadingSet: level1EnrichmentState.loadingNodes.has(nodeId)
  }));
  
  return {
    isPolling: level1EnrichmentState.isPolling,
    loadingNodesCount: level1EnrichmentState.loadingNodes.size,
    statusCount: level1EnrichmentState.enrichmentStatus.size,
    statuses: statusArray
  };
};

// Expose debug functions to window for console access
if (typeof window !== 'undefined') {
  (window as any).getLevel1EnrichmentState = getLevel1EnrichmentState;
  (window as any).enableLevel1EnrichmentDebug = false;
}

// Function to initialize enrichment status from database (for page refresh scenarios)
const initializeEnrichmentStatusFromDatabase = async (level1NodeIds: string[]) => {
  try {
    console.log(`[LEVEL1_ENRICHMENT] Initializing enrichment status from database for ${level1NodeIds.length} nodes`);

    // Check papers and use cases in parallel for all nodes
    const [papersResult, useCasesResult] = await Promise.all([
      supabase
        .from("node_papers")
        .select("node_id")
        .in("node_id", level1NodeIds),
      supabase
        .from("node_use_cases")
        .select("node_id")
        .in("node_id", level1NodeIds)
    ]);

    // Process results to determine which nodes have data
    const nodesWithPapers = new Set(papersResult.data?.map(p => p.node_id) || []);
    const nodesWithUseCases = new Set(useCasesResult.data?.map(u => u.node_id) || []);

    // Count papers and use cases per node
    const paperCounts = new Map<string, number>();
    const useCaseCounts = new Map<string, number>();
    
    if (papersResult.data) {
      for (const paper of papersResult.data) {
        paperCounts.set(paper.node_id, (paperCounts.get(paper.node_id) || 0) + 1);
      }
    }
    
    if (useCasesResult.data) {
      for (const useCase of useCasesResult.data) {
        useCaseCounts.set(useCase.node_id, (useCaseCounts.get(useCase.node_id) || 0) + 1);
      }
    }

    // Initialize status for each node based on database state
    level1NodeIds.forEach(nodeId => {
      const hasPapers = nodesWithPapers.has(nodeId);
      const hasUseCases = nodesWithUseCases.has(nodeId);
      const paperCount = paperCounts.get(nodeId) || 0;
      const useCaseCount = useCaseCounts.get(nodeId) || 0;

      // Set status based on what we found in the database
      level1EnrichmentState.enrichmentStatus.set(nodeId, {
        nodeId,
        hasStarted: true, // Always mark as started since tree generation has begun
        hasPapers,
        hasUseCases,
        paperCount,
        useCaseCount,
      });

      // For level 1 nodes, assume they're loading if they don't have complete data
      // This ensures loading indicators persist across page refreshes during generation
      if (paperCount === 0 || useCaseCount === 0) {
        level1EnrichmentState.loadingNodes.add(nodeId);
        console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} added to loading set - papers: ${hasPapers} (${paperCount}), useCases: ${hasUseCases} (${useCaseCount})`);
        console.log(`[LEVEL1_ENRICHMENT] Loading conditions: paperCount === 0: ${paperCount === 0}, useCaseCount === 0: ${useCaseCount === 0}`);
      } else {
        console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} already complete - papers: ${paperCount}, useCases: ${useCaseCount}`);
      }
    });

    console.log(`[LEVEL1_ENRICHMENT] Initialization complete - ${level1EnrichmentState.loadingNodes.size} nodes still loading`);

  } catch (error) {
    console.error(`[LEVEL1_ENRICHMENT] Error initializing from database:`, error);
    
    // Fallback: initialize all nodes as loading if database check fails
    level1NodeIds.forEach(nodeId => {
      level1EnrichmentState.loadingNodes.add(nodeId);
      level1EnrichmentState.enrichmentStatus.set(nodeId, {
        nodeId,
        hasStarted: true,
        hasPapers: false,
        hasUseCases: false,
        paperCount: 0,
        useCaseCount: 0,
      });
    });
  }
};

// Function to start tracking level 1 nodes for enrichment
export const startLevel1EnrichmentTracking = async (level1NodeIds: string[]) => {
  console.log(`[LEVEL1_ENRICHMENT] Starting tracking for ${level1NodeIds.length} level 1 nodes`);
  
  // Initialize enrichment status from database to handle page refresh scenarios
  await initializeEnrichmentStatusFromDatabase(level1NodeIds);
};

// Function to stop tracking when tree generation completes
export const stopLevel1EnrichmentTracking = () => {
  console.log(`[LEVEL1_ENRICHMENT] Stopping enrichment tracking`);
  level1EnrichmentState.loadingNodes.clear();
  level1EnrichmentState.enrichmentStatus.clear();
  level1EnrichmentState.isPolling = false;
};

// Hook for components to use level 1 enrichment polling
export const useLevel1EnrichmentPolling = (treeId: string | null, level1NodeIds: string[]) => {
  const [, forceUpdate] = useState({});
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedCounts = useRef<Map<string, { papers: number; useCases: number }>>(new Map());

  // Force re-render when enrichment state changes
  const triggerUpdate = () => forceUpdate({});

  // Start polling when tree ID and level 1 nodes are available
  useEffect(() => {
    if (!treeId || level1NodeIds.length === 0) {
      return;
    }

    // If we're already polling for a different tree, stop first
    if (level1EnrichmentState.isPolling) {
      console.log(`[LEVEL1_ENRICHMENT] Stopping previous polling session`);
      stopLevel1EnrichmentTracking();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    console.log(`[LEVEL1_ENRICHMENT] Starting polling for tree ${treeId} with ${level1NodeIds.length} level 1 nodes`);
    
    level1EnrichmentState.isPolling = true;
    
    // Initialize tracking and start polling (async to ensure proper initialization)
    const initializeAndStartPolling = async () => {
      await startLevel1EnrichmentTracking(level1NodeIds);
      
      // Force update after initialization to show loading indicators
      triggerUpdate();

      // Initial check for existing data
      checkLevel1EnrichmentStatus(level1NodeIds);

      // Start polling every 5 seconds (moderate balance of responsiveness vs load)
      pollingIntervalRef.current = setInterval(() => {
        checkLevel1EnrichmentStatus(level1NodeIds);
      }, 5000);
    };
    
    initializeAndStartPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [treeId, level1NodeIds.join(',')]);

  // Stop polling when component unmounts
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      stopLevel1EnrichmentTracking();
    };
  }, []);

  const checkLevel1EnrichmentStatus = async (nodeIds: string[]) => {
    try {
      console.log(`[LEVEL1_ENRICHMENT] Checking enrichment status for ${nodeIds.length} nodes`);

      // Check papers and use cases in parallel for all nodes
      const [papersResult, useCasesResult] = await Promise.all([
        supabase
          .from("node_papers")
          .select("node_id")
          .in("node_id", nodeIds),
        supabase
          .from("node_use_cases")
          .select("node_id")
          .in("node_id", nodeIds)
      ]);

      // Process papers data
      const nodesWithPapers = new Set(papersResult.data?.map(p => p.node_id) || []);
      const paperCounts = new Map<string, number>();
      
      if (papersResult.data) {
        for (const paper of papersResult.data) {
          paperCounts.set(paper.node_id, (paperCounts.get(paper.node_id) || 0) + 1);
        }
      }

      // Process use cases data
      const nodesWithUseCases = new Set(useCasesResult.data?.map(u => u.node_id) || []);
      const useCaseCounts = new Map<string, number>();
      
      if (useCasesResult.data) {
        for (const useCase of useCasesResult.data) {
          useCaseCounts.set(useCase.node_id, (useCaseCounts.get(useCase.node_id) || 0) + 1);
        }
      }

      let hasUpdates = false;

      // Update status for each node
      for (const nodeId of nodeIds) {
        const currentStatus = level1EnrichmentState.enrichmentStatus.get(nodeId);
        if (!currentStatus) continue;

        const hasPapers = nodesWithPapers.has(nodeId);
        const hasUseCases = nodesWithUseCases.has(nodeId);
        const paperCount = paperCounts.get(nodeId) || 0;
        const useCaseCount = useCaseCounts.get(nodeId) || 0;

        // Check if this is a new completion
        const lastCounts = lastCheckedCounts.current.get(nodeId) || { papers: 0, useCases: 0 };
        const papersJustCompleted = !currentStatus.hasPapers && hasPapers;
        const useCasesJustCompleted = !currentStatus.hasUseCases && hasUseCases;

        // Update the status
        const newStatus: Level1EnrichmentStatus = {
          ...currentStatus,
          hasPapers,
          hasUseCases,
          paperCount,
          useCaseCount,
        };

        level1EnrichmentState.enrichmentStatus.set(nodeId, newStatus);

        // Update last checked counts
        lastCheckedCounts.current.set(nodeId, { papers: paperCount, useCases: useCaseCount });

        // Check for any status changes and trigger updates accordingly
        let statusChanged = false;
        
        // Check if papers status changed
        if (papersJustCompleted) {
          console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} papers completed! (${paperCount} papers)`);
          statusChanged = true;
        }
        
        // Check if use cases status changed  
        if (useCasesJustCompleted) {
          console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} use cases completed! (${useCaseCount} use cases)`);
          statusChanged = true;
        }
        
        // If any status changed, trigger UI update and sidebar refresh
        if (statusChanged) {
          hasUpdates = true;
          triggerEnrichmentRefresh(nodeId);
          console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} status update - papers: ${hasPapers}, useCases: ${hasUseCases}`);
        }
        
        // Also trigger update if current loading state has changed (for UI re-render)
        const shouldShowPapersLoading = currentStatus.hasStarted && !hasPapers;
        const shouldShowUseCasesLoading = currentStatus.hasStarted && !hasUseCases;
        const wasShowingPapersLoading = currentStatus.hasStarted && !currentStatus.hasPapers;
        const wasShowingUseCasesLoading = currentStatus.hasStarted && !currentStatus.hasUseCases;
        
        if (shouldShowPapersLoading !== wasShowingPapersLoading || shouldShowUseCasesLoading !== wasShowingUseCasesLoading) {
          hasUpdates = true;
          console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} loading state changed - papers loading: ${wasShowingPapersLoading} -> ${shouldShowPapersLoading}, usecases loading: ${wasShowingUseCasesLoading} -> ${shouldShowUseCasesLoading}`);
        }
        
        // If both are complete, remove from loading set
        if (hasPapers && hasUseCases) {
          level1EnrichmentState.loadingNodes.delete(nodeId);
          console.log(`[LEVEL1_ENRICHMENT] Node ${nodeId} fully enriched - removed from loading set`);
        }
      }

      // Check if all nodes are complete (both papers AND use cases)
      const completeNodes = nodeIds.filter(nodeId => {
        const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
        return status?.hasPapers && status?.hasUseCases;
      });
      
      const pendingNodes = nodeIds.filter(nodeId => {
        const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
        return !status?.hasPapers || !status?.hasUseCases;
      });
      
      console.log(`[LEVEL1_ENRICHMENT] Progress: ${completeNodes.length}/${nodeIds.length} nodes complete. Pending: [${pendingNodes.join(', ')}]`);
      
      const allComplete = completeNodes.length === nodeIds.length;

      if (allComplete && level1EnrichmentState.isPolling) {
        console.log(`[LEVEL1_ENRICHMENT] All level 1 nodes enrichment completed, stopping polling`);
        stopLevel1EnrichmentTracking();
        
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        hasUpdates = true;
      } else if (level1EnrichmentState.isPolling) {
        // Log current status for debugging
        const statusSummary = nodeIds.map(nodeId => {
          const status = level1EnrichmentState.enrichmentStatus.get(nodeId);
          return `${nodeId}: P${status?.hasPapers ? '✓' : '✗'} U${status?.hasUseCases ? '✓' : '✗'}`;
        }).join(', ');
        console.log(`[LEVEL1_ENRICHMENT] Continuing polling - Status: ${statusSummary}`);
      }

      // Force re-render if there were updates
      if (hasUpdates) {
        triggerUpdate();
      }

    } catch (error) {
      console.error(`[LEVEL1_ENRICHMENT] Error checking enrichment status:`, error);
    }
  };

  return {
    isLevel1Loading,
    isLevel1PapersLoading,
    isLevel1UseCasesLoading,
  };
};