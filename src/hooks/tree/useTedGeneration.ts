
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TedNode {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
}

export interface TedLayer {
  layer: "purpose" | "function" | "measure";
  nodes: TedNode[];
  generation_metadata: {
    total_nodes: number;
    abstraction_level: string;
    coverage_note: string;
  };
}

export interface TedEvaluation {
  total_score: number;
  passing_grade: number;
  needs_regeneration: boolean;
  evaluated_layer: string;
  overall_feedback: string;
  regeneration_priority: "high" | "medium" | "low";
}

export interface GenerationProgress {
  current_layer: "purpose" | "function" | "measure" | "complete";
  current_step: "generating" | "evaluating" | "regenerating" | "complete";
  attempt_count: number;
  layer_results: {
    purpose?: { layer: TedLayer; evaluation: TedEvaluation };
    function?: { layer: TedLayer; evaluation: TedEvaluation };
    measure?: { layer: TedLayer; evaluation: TedEvaluation };
  };
}

export const useTedGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    current_layer: "purpose",
    current_step: "generating",
    attempt_count: 0,
    layer_results: {}
  });
  const [error, setError] = useState<string | null>(null);

  const generateLayer = async (
    query: string,
    targetLayer: "purpose" | "function" | "measure",
    parentNodes: TedNode[] = [],
    context: string = ""
  ): Promise<TedLayer | null> => {
    try {
      console.log(`Generating ${targetLayer} layer...`);
      
      const { data, error } = await supabase.functions.invoke('generate-ted-layer', {
        body: {
          query,
          target_layer: targetLayer,
          parent_nodes: parentNodes,
          context
        }
      });

      if (error) {
        console.error('Layer generation error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate layer');
      }

      return data.layer_data;
    } catch (error) {
      console.error(`Error generating ${targetLayer} layer:`, error);
      return null;
    }
  };

  const evaluateLayer = async (
    layerData: TedLayer,
    parentLayer: TedNode[] = [],
    originalQuery: string,
    context: string = ""
  ): Promise<TedEvaluation | null> => {
    try {
      console.log(`Evaluating ${layerData.layer} layer...`);
      
      const { data, error } = await supabase.functions.invoke('evaluate-ted-layer', {
        body: {
          layer_data: layerData,
          parent_layer: parentLayer,
          original_query: originalQuery,
          layer_context: context
        }
      });

      if (error) {
        console.error('Layer evaluation error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to evaluate layer');
      }

      return data.evaluation;
    } catch (error) {
      console.error(`Error evaluating ${layerData.layer} layer:`, error);
      return null;
    }
  };

  const generateCompleteTree = async (query: string) => {
    setIsGenerating(true);
    setError(null);
    setProgress({
      current_layer: "purpose",
      current_step: "generating",
      attempt_count: 0,
      layer_results: {}
    });

    try {
      const layers: ("purpose" | "function" | "measure")[] = ["purpose", "function", "measure"];
      const results: GenerationProgress["layer_results"] = {};
      
      for (const layerType of layers) {
        let layerGenerated = false;
        let attemptCount = 0;
        const maxAttempts = 3;

        while (!layerGenerated && attemptCount < maxAttempts) {
          attemptCount++;
          
          // Update progress
          setProgress(prev => ({
            ...prev,
            current_layer: layerType,
            current_step: attemptCount === 1 ? "generating" : "regenerating",
            attempt_count: attemptCount
          }));

          // Get parent nodes for this layer
          const parentNodes = layerType === "purpose" ? [] : 
                             layerType === "function" ? results.purpose?.layer.nodes || [] :
                             results.function?.layer.nodes || [];

          // Generate layer
          const layerData = await generateLayer(
            query,
            layerType,
            parentNodes,
            `Attempt ${attemptCount} for ${layerType} layer`
          );

          if (!layerData) {
            throw new Error(`Failed to generate ${layerType} layer on attempt ${attemptCount}`);
          }

          // Update progress to evaluation
          setProgress(prev => ({
            ...prev,
            current_step: "evaluating"
          }));

          // Evaluate layer
          const evaluation = await evaluateLayer(
            layerData,
            parentNodes,
            query,
            `Evaluation attempt ${attemptCount}`
          );

          if (!evaluation) {
            throw new Error(`Failed to evaluate ${layerType} layer on attempt ${attemptCount}`);
          }

          // Check if layer passes
          if (!evaluation.needs_regeneration) {
            results[layerType] = { layer: layerData, evaluation };
            layerGenerated = true;
            
            toast({
              title: `${layerType} layer completed`,
              description: `Score: ${evaluation.total_score}/${evaluation.passing_grade * 4} (${Math.round(evaluation.total_score / 4)}%)`,
            });
          } else {
            toast({
              title: `${layerType} layer needs improvement`,
              description: `Score: ${evaluation.total_score}/${evaluation.passing_grade * 4}. Regenerating...`,
            });
          }
        }

        if (!layerGenerated) {
          throw new Error(`Failed to generate acceptable ${layerType} layer after ${maxAttempts} attempts`);
        }
      }

      // Update final progress
      setProgress(prev => ({
        ...prev,
        current_layer: "complete",
        current_step: "complete",
        layer_results: results
      }));

      toast({
        title: "TED Tree Generation Complete",
        description: "All layers have been successfully generated and validated.",
      });

      return results;

    } catch (error) {
      console.error('TED generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate TED tree');
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate TED tree',
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getProgressText = () => {
    if (!isGenerating) return "";
    
    const { current_layer, current_step, attempt_count } = progress;
    
    if (current_layer === "complete") {
      return "TED tree generation completed successfully!";
    }
    
    const layerName = {
      purpose: "Purpose (目的)",
      function: "Function (機能)",
      measure: "Measure (手段/技術)"
    }[current_layer];
    
    const stepText = {
      generating: "Generating",
      evaluating: "Evaluating",
      regenerating: `Regenerating (attempt ${attempt_count})`,
      complete: "Complete"
    }[current_step];
    
    return `${stepText} ${layerName} layer...`;
  };

  return {
    isGenerating,
    progress,
    error,
    generateCompleteTree,
    getProgressText
  };
};
