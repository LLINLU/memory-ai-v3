import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getEnrichmentStatus } from "@/services/enrichmentQueue";
import type { EnrichmentStatus } from "@/services/enrichmentQueue";

interface Paper {
  id: string;
  title: string;
  authors?: string; // Make optional
  journal?: string; // Make optional
  tags?: string[]; // Make optional
  abstract?: string; // Make optional
  date: string | null; // Allow null dates for papers without publication dates
  citations?: number; // Make optional
  region: "domestic" | "international";
  doi: string;
  score: number;
  url?: string;
}

interface UseCase {
  id: string;
  product: string;
  description: string;
  company: string[];
  press_releases: string[];
}

interface EnrichedData {
  papers: Paper[];
  useCases?: UseCase[];
  loading: boolean;
  loadingPapers: boolean;
  loadingUseCases: boolean;
  error: string | null;
  refresh: () => void;
}

// Global event bus for triggering enriched data refreshes
export const enrichmentEventBus = {
  listeners: new Set<(nodeId: string) => void>(),
  
  subscribe(listener: (nodeId: string) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  
  emit(nodeId: string) {
    this.listeners.forEach(listener => listener(nodeId));
  }
};

// Event bus for tracking when enrichment starts
const enrichmentStartEventBus = {
  listeners: new Set<(nodeId: string) => void>(),
  
  subscribe(listener: (nodeId: string) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  
  emit(nodeId: string) {
    this.listeners.forEach(listener => listener(nodeId));
  }
};

// Export function to trigger refresh from outside
export const triggerEnrichmentRefresh = (nodeId: string) => {
  console.log(`[ENRICHMENT_REFRESH] Triggering refresh for node: ${nodeId}`);
  enrichmentEventBus.emit(nodeId);
};

// Export function to signal enrichment start
export const triggerEnrichmentStart = (nodeId: string) => {
  console.log(`[ENRICHMENT_START] Triggering start for node: ${nodeId}`);
  enrichmentStartEventBus.emit(nodeId);
};

// Export functions to signal specific enrichment starts
export const triggerPapersStart = (nodeId: string) => {
  console.log(`[PAPERS_START] Triggering papers start for node: ${nodeId}`);
  // We'll emit a custom event for papers specifically
  enrichmentEventBus.emit(`${nodeId}:papers:start`);
};

export const triggerUseCasesStart = (nodeId: string) => {
  console.log(`[USECASES_START] Triggering use cases start for node: ${nodeId}`);
  // We'll emit a custom event for use cases specifically
  enrichmentEventBus.emit(`${nodeId}:usecases:start`);
};

export const useEnrichedData = (nodeId: string | null): EnrichedData => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [loadingUseCases, setLoadingUseCases] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const nodeIdRef = useRef<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Force refresh function
  const refresh = () => {
    console.log(`[useEnrichedData] Manual refresh triggered for nodeId: ${nodeId}`);
    setRefreshTrigger(prev => prev + 1);
  };

  // Subscribe to global enrichment events
  useEffect(() => {
    if (!nodeId) return;
    
    const unsubscribeRefresh = enrichmentEventBus.subscribe((enrichedNodeId) => {
      if (enrichedNodeId === nodeId) {
        console.log(`[useEnrichedData] External refresh triggered for nodeId: ${nodeId}`);
        setRefreshTrigger(prev => prev + 1);
      }
    });
    
    // We no longer need the start event listeners since we're using queue status
    // The queue status effect will handle loading states more accurately
    
    return () => {
      unsubscribeRefresh();
    };
  }, [nodeId]);

  // Effect to check enrichment queue status and update loading states
  useEffect(() => {
    if (!nodeId) return;

    const checkQueueStatus = () => {
      const papersStatus = getEnrichmentStatus(nodeId, 'papers');
      const useCasesStatus = getEnrichmentStatus(nodeId, 'useCases');
      
      // Update papers loading state based on queue status
      const isPapersLoading = papersStatus === 'waiting' || papersStatus === 'fetching';
      setLoadingPapers(isPapersLoading);
      
      // Update use cases loading state based on queue status  
      const isUseCasesLoading = useCasesStatus === 'waiting' || useCasesStatus === 'fetching';
      setLoadingUseCases(isUseCasesLoading);
      
      console.log(`[useEnrichedData] Queue status check for ${nodeId}:`, {
        papersStatus,
        useCasesStatus,
        isPapersLoading,
        isUseCasesLoading
      });
    };

    // Check immediately
    checkQueueStatus();

    // Set up interval to check queue status regularly
    const interval = setInterval(checkQueueStatus, 1000);

    return () => clearInterval(interval);
  }, [nodeId]);

  useEffect(() => {
    if (!nodeId) {
      setPapers([]);
      setUseCases([]);
      setLoading(false);
      setLoadingPapers(false);
      setLoadingUseCases(false);
      setError(null);
      setInitialLoad(true);
      return;
    }
    
    // Reset loading states when nodeId changes
    if (nodeIdRef.current !== nodeId) {
      nodeIdRef.current = nodeId;
      setLoadingPapers(false);
      setLoadingUseCases(false);
      setInitialLoad(true);
    }
    
    const loadEnrichedData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`[useEnrichedData] Loading data for nodeId: ${nodeId}, refreshTrigger: ${refreshTrigger}`);

        // Load papers and use cases concurrently
        const [papersResult, useCasesResult] = await Promise.allSettled([
          supabase
            .from("node_papers" as any)
            .select("*")
            .eq("node_id", nodeId),
          supabase
            .from("node_use_cases" as any)
            .select("*")
            .eq("node_id", nodeId)
        ]);

        // Handle papers result
        if (papersResult.status === 'fulfilled') {
          const { data: papersData, error: papersError } = papersResult.value;
          console.log(`[useEnrichedData] Papers query result:`, {
            data: papersData,
            error: papersError,
            dataLength: papersData?.length || 0,
          });

          if (papersError) {
            console.error(`Failed to load papers: ${papersError.message}`);
          } else {
            const papersList = (papersData as any) || [];
            setPapers(papersList);
            console.log(`[useEnrichedData] Papers set to state:`, papersList);
            // Only turn off loading if we actually have data
            // Let the queue status effect handle loading states based on actual queue status
            if (papersList.length > 0) {
              setLoadingPapers(false);
            }
          }
        } else {
          console.error("Papers query failed:", papersResult.reason);
        }

        // Handle use cases result
        if (useCasesResult.status === 'fulfilled') {
          const { data: useCasesData, error: useCasesError } = useCasesResult.value;
          console.log(`[useEnrichedData] Use cases query result:`, {
            data: useCasesData,
            error: useCasesError,
            dataLength: useCasesData?.length || 0,
          });

          if (useCasesError) {
            console.error(`Failed to load use cases: ${useCasesError.message}`);
          } else {
            const useCasesList = (useCasesData as any) || [];
            setUseCases(useCasesList);
            console.log(`[useEnrichedData] Use cases set to state:`, useCasesList);
            // Only turn off loading if we actually have data
            // Let the queue status effect handle loading states based on actual queue status
            if (useCasesList.length > 0) {
              setLoadingUseCases(false);
            }
          }
        } else {
          console.error("Use cases query failed:", useCasesResult.reason);
        }

      } catch (err) {
        console.error("Error loading enriched data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setPapers([]);
        setUseCases([]);
        // Don't override loading states here - let queue status handle them
      } finally {
        setLoading(false);
      }
    };

    loadEnrichedData();
  }, [nodeId, refreshTrigger]);

  return {
    papers,
    useCases,
    loading,
    loadingPapers,
    loadingUseCases,
    error,
    refresh,
  };
};
