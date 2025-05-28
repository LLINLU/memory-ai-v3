
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TreemapData {
  name: string;
  size: number;
  fill: string;
  papers: number;
}

export const useTreemapGeneration = () => {
  const [treemapData, setTreemapData] = useState<TreemapData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTreemap = useCallback(async (query: string, scenario?: string) => {
    if (!query || query.trim() === '') {
      console.log("No query provided, skipping treemap generation");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating treemap for query:", query);
      console.log("With scenario:", scenario || "No scenario provided");
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-treemap', {
        body: { 
          query,
          scenario: scenario || undefined,
          context: "research_areas" 
        }
      });

      console.log("Edge function response:", data);
      console.log("Edge function error:", functionError);

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message || "Failed to generate treemap");
      }

      if (data?.treemapData && Array.isArray(data.treemapData)) {
        setTreemapData(data.treemapData);
        console.log("Generated treemap data:", data.treemapData);
      } else {
        console.log("No treemap data received, using fallback");
        throw new Error("No treemap data received from edge function");
      }
    } catch (err) {
      console.error("Error generating treemap:", err);
      setError(err instanceof Error ? err.message : "Failed to generate treemap");
      
      // Generate query-based fallback data
      const fallbackData = [
        { name: `${query} - 主要研究`, size: 40, fill: "#4C7CFC", papers: 40 },
        { name: `${query} - 応用研究`, size: 30, fill: "#8D84C6", papers: 30 },
        { name: `${query} - 技術開発`, size: 20, fill: "#A94CF7", papers: 20 },
        { name: `${query} - その他`, size: 10, fill: "#4A3D78", papers: 10 }
      ];
      
      console.log("Using query-based fallback data:", fallbackData);
      setTreemapData(fallbackData);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    treemapData,
    isGenerating,
    error,
    generateTreemap
  };
};
