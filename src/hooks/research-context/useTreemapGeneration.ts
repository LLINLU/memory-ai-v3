
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
      console.log("With scenario:", scenario);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-treemap', {
        body: { 
          query,
          scenario,
          context: "research_areas" 
        }
      });

      console.log("Edge function response:", data);
      console.log("Edge function error:", functionError);

      if (functionError) {
        throw new Error(functionError.message);
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
      
      // Fallback to default data on error
      const fallbackData = [
        { name: "Primary Research", size: 40, fill: "#4C7CFC", papers: 40 },
        { name: "Secondary Analysis", size: 30, fill: "#8D84C6", papers: 30 },
        { name: "Applications", size: 20, fill: "#A94CF7", papers: 20 },
        { name: "Other Areas", size: 10, fill: "#4A3D78", papers: 10 }
      ];
      
      console.log("Using fallback data:", fallbackData);
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
