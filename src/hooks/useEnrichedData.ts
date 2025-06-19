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

// Export function to trigger refresh from outside
export const triggerEnrichmentRefresh = (nodeId: string) => {
  console.log(`[ENRICHMENT_REFRESH] Triggering refresh for node: ${nodeId}`);
  enrichmentEventBus.emit(nodeId);
};

export const useEnrichedData = (nodeId: string | null): EnrichedData => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const nodeIdRef = useRef<string | null>(null);

  // Force refresh function
  const refresh = () => {
    console.log(`[useEnrichedData] Manual refresh triggered for nodeId: ${nodeId}`);
    setRefreshTrigger(prev => prev + 1);
  };

  // Subscribe to global enrichment events
  useEffect(() => {
    if (!nodeId) return;
    
    const unsubscribe = enrichmentEventBus.subscribe((enrichedNodeId) => {
      if (enrichedNodeId === nodeId) {
        console.log(`[useEnrichedData] External refresh triggered for nodeId: ${nodeId}`);
        setRefreshTrigger(prev => prev + 1);
      }
    });
    
    return unsubscribe;
  }, [nodeId]);
  useEffect(() => {
    if (!nodeId) {
      setPapers([]);
      setUseCases([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    const loadEnrichedData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`[useEnrichedData] Loading data for nodeId: ${nodeId}, refreshTrigger: ${refreshTrigger}`);

        // Load papers
        const { data: papersData, error: papersError } = await supabase
          .from("node_papers" as any)
          .select("*")
          .eq("node_id", nodeId);

        console.log(`[useEnrichedData] Papers query result:`, {
          data: papersData,
          error: papersError,
          dataLength: papersData?.length || 0,
        });

        if (papersError) {
          throw new Error(`Failed to load papers: ${papersError.message}`);
        }

        // Set papers data with proper typing
        setPapers((papersData as any) || []);
        console.log(
          `[useEnrichedData] Papers set to state:`,
          (papersData as any) || []
        );

        // Load use cases from the database
        const { data: useCasesData, error: useCasesError } = await supabase
          .from("node_use_cases" as any)
          .select("*")
          .eq("node_id", nodeId);

        console.log(`[useEnrichedData] Use cases query result:`, {
          data: useCasesData,
          error: useCasesError,
          dataLength: useCasesData?.length || 0,
        });

        if (useCasesError) {
          throw new Error(`Failed to load use cases: ${useCasesError.message}`);
        }

        // Set use cases data
        setUseCases((useCasesData as any) || []);
        console.log(
          `[useEnrichedData] Use cases set to state:`,
          (useCasesData as any) || []
        );
      } catch (err) {
        console.error("Error loading enriched data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setPapers([]);
        setUseCases([]);
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
    error,
    refresh,
  };
};
