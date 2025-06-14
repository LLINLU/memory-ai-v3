import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  tags: string[];
  abstract: string;
  date: string;
  citations: number;
  region: "domestic" | "international";
  doi?: string;
  url?: string;
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  releases: number;
  pressReleases: Array<{
    title: string;
    url: string;
    date?: string;
  }>;
}

interface EnrichedData {
  papers: Paper[];
  useCases: UseCase[];
  loading: boolean;
  error: string | null;
}

export const useEnrichedData = (nodeId: string | null): EnrichedData => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Load papers
        const { data: papersData, error: papersError } = await supabase
          .from("node_papers")
          .select("*")
          .eq("node_id", nodeId);

        if (papersError) {
          throw new Error(`Failed to load papers: ${papersError.message}`);
        }

        // Load use cases with press releases
        const { data: useCasesData, error: useCasesError } = await supabase
          .from("node_use_cases")
          .select(
            `
            *,
            use_case_press_releases(*)
          `
          )
          .eq("node_id", nodeId);

        if (useCasesError) {
          throw new Error(`Failed to load use cases: ${useCasesError.message}`);
        }

        // Transform use cases data to include press releases
        const transformedUseCases =
          useCasesData?.map((useCase) => ({
            ...useCase,
            pressReleases: useCase.use_case_press_releases || [],
          })) || [];

        setPapers(papersData || []);
        setUseCases(transformedUseCases);
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
  }, [nodeId]);

  return {
    papers,
    useCases,
    loading,
    error,
  };
};
