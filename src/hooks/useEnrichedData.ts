import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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
const enrichmentEventBus = {
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
    
    const unsubscribeStart = enrichmentStartEventBus.subscribe((enrichedNodeId) => {
      if (enrichedNodeId === nodeId) {
        console.log(`[useEnrichedData] Enrichment start triggered for nodeId: ${nodeId}`);
        setLoadingPapers(true);
        setLoadingUseCases(true);
        setInitialLoad(false);
      }
    });
    
    return () => {
      unsubscribeRefresh();
      unsubscribeStart();
    };
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
      // Only set individual loading states on initial load
      if (initialLoad) {
        setLoadingPapers(true);
        setLoadingUseCases(true);
        setInitialLoad(false);
      }
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
            // Turn off loading if we got data, or if this is a refresh (regardless of data)
            if (papersList.length > 0) {
              setLoadingPapers(false);
            } else if (refreshTrigger > 0) {
              // This is a refresh but no data - likely means enrichment failed or no data exists
              setLoadingPapers(false);
            }
          }
        } else {
          console.error("Papers query failed:", papersResult.reason);
          setLoadingPapers(false);
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
            // Turn off loading if we got data, or if this is a refresh (regardless of data)
            if (useCasesList.length > 0) {
              setLoadingUseCases(false);
            } else if (refreshTrigger > 0) {
              // This is a refresh but no data - likely means enrichment failed or no data exists
              setLoadingUseCases(false);
            }
          }
        } else {
          console.error("Use cases query failed:", useCasesResult.reason);
          setLoadingUseCases(false);
        }

      } catch (err) {
        console.error("Error loading enriched data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setPapers([]);
        setUseCases([]);
        setLoadingPapers(false);
        setLoadingUseCases(false);
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
