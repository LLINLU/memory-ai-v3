
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useTreemapGeneration } from "@/hooks/research-context/useTreemapGeneration";

interface TreemapEffectsProps {
  query?: string;
  scenario?: string;
  searchMode?: string;
}

export const useTreemapEffects = ({ query, scenario, searchMode }: TreemapEffectsProps) => {
  const { treemapData, isGenerating, error, generateTreemap } = useTreemapGeneration();

  // Generate treemap based on search mode and available data
  useEffect(() => {
    console.log("TreemapEffects: Checking treemap generation conditions");
    console.log("- Query:", query);
    console.log("- Scenario:", scenario);
    console.log("- Search Mode:", searchMode);
    
    if (query && query.trim() !== '') {
      if (searchMode === "quick") {
        // For quick exploration, generate treemap with just the query
        console.log("TreemapEffects: Quick mode - generating treemap with query only");
        generateTreemap(query);
      } else if (searchMode === "deep" && scenario && scenario.trim() !== '') {
        // For deep exploration, use both scenario and query
        console.log("TreemapEffects: Deep mode - generating treemap with scenario and query");
        generateTreemap(query, scenario);
      } else if (searchMode === "deep") {
        console.log("TreemapEffects: Deep mode but no scenario available yet");
      } else {
        // Fallback: if searchMode is undefined or other value, generate with query
        console.log("TreemapEffects: Fallback mode - generating treemap with query only");
        generateTreemap(query);
      }
    } else {
      console.log("TreemapEffects: No query available for treemap generation");
    }
  }, [query, scenario, searchMode, generateTreemap]);

  // Show error toast if treemap generation fails
  useEffect(() => {
    if (error) {
      toast({
        title: "研究エリア生成エラー",
        description: "研究エリアの生成中にエラーが発生しました。デフォルトデータを表示しています。",
        variant: "destructive",
      });
    }
  }, [error]);

  return {
    treemapData,
    isGenerating,
    error
  };
};
