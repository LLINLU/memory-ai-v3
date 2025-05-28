
import { useState } from "react";
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

  const generateTreemap = async (query: string, scenario?: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating treemap for query:", query);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-treemap', {
        body: { 
          query,
          scenario,
          context: "research_areas" 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.treemapData) {
        setTreemapData(data.treemapData);
        console.log("Generated treemap data:", data.treemapData);
      } else {
        throw new Error("No treemap data received from edge function");
      }
    } catch (err) {
      console.error("Error generating treemap:", err);
      setError(err instanceof Error ? err.message : "Failed to generate treemap");
      
      // Fallback to default data on error
      setTreemapData([
        { name: "Primary Research", size: 40, fill: "#4C7CFC", papers: 40 },
        { name: "Secondary Analysis", size: 30, fill: "#8D84C6", papers: 30 },
        { name: "Applications", size: 20, fill: "#A94CF7", papers: 20 },
        { name: "Other Areas", size: 10, fill: "#4A3D78", papers: 10 }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    treemapData,
    isGenerating,
    error,
    generateTreemap
  };
};
