
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getMockTedData } from './useMockTedData';

export const useTedGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<string>('');
  const [currentAttempt, setCurrentAttempt] = useState<number>(0);

  const generateLayer = async (
    query: string,
    targetLayer: 'purpose' | 'function' | 'measure',
    parentNodes: any[] = [],
    context: string = ''
  ) => {
    try {
      console.log(`Generating ${targetLayer} layer with query:`, query);
      
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
        throw new Error(`Generation failed: ${error.message}`);
      }

      if (!data || !data.success) {
        console.error('Layer generation failed:', data);
        throw new Error(`Failed to generate ${targetLayer} layer: ${data?.error || 'Unknown error'}`);
      }

      console.log(`Successfully generated ${targetLayer} layer:`, data.layer_data);
      return data.layer_data;
      
    } catch (error) {
      console.error(`Error generating ${targetLayer} layer:`, error);
      throw new Error(`Failed to generate ${targetLayer} layer: ${error.message}`);
    }
  };

  const generateCompleteTree = async (query: string, maxRetries = 3) => {
    setIsGenerating(true);
    setCurrentAttempt(0);
    
    try {
      console.log('Starting TED tree generation with query:', query);
      
      // Try OpenAI generation first, but with immediate fallback to mock data
      let results: any = null;
      
      try {
        console.log('Attempting OpenAI generation...');
        setCurrentLayer('purpose');
        setCurrentAttempt(1);
        
        // Generate Purpose layer
        const purposeLayer = await generateLayer(query, 'purpose');
        
        setCurrentLayer('function');
        setCurrentAttempt(2);
        
        // Generate Function layer  
        const functionLayer = await generateLayer(
          query, 
          'function', 
          purposeLayer.nodes,
          'Based on the purpose layer nodes'
        );
        
        setCurrentLayer('measure');
        setCurrentAttempt(3);
        
        // Generate Measure layer
        const measureLayer = await generateLayer(
          query,
          'measure',
          functionLayer.nodes,
          'Based on the function layer nodes'
        );

        results = {
          purpose: { layer: purposeLayer, evaluation: purposeLayer.generation_metadata },
          function: { layer: functionLayer, evaluation: functionLayer.generation_metadata },
          measure: { layer: measureLayer, evaluation: measureLayer.generation_metadata }
        };
        
        console.log('OpenAI generation successful:', results);
        
      } catch (openaiError) {
        console.log('OpenAI generation failed, using mock data fallback:', openaiError);
        
        // Fallback to mock data
        setCurrentLayer('mock-data');
        setCurrentAttempt(1);
        
        results = getMockTedData(query);
        
        toast({
          title: "Using Mock Data",
          description: "OpenAI rate limits encountered. Generated tree using high-quality mock data based on your query.",
          duration: 4000,
        });
      }

      console.log('Final TED results:', results);
      return results;

    } catch (error) {
      console.error('TED generation error:', error);
      
      toast({
        title: "Generation Error",
        description: "Failed to generate TED tree. Please try again later.",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
      setCurrentLayer('');
      setCurrentAttempt(0);
    }
  };

  const getProgressText = () => {
    if (!isGenerating) return '';
    
    if (currentLayer === 'mock-data') {
      return 'Generating mock TED tree structure...';
    }
    
    const layerNames = {
      purpose: 'Purpose Layer (目的層)',
      function: 'Function Layer (機能層)', 
      measure: 'Measure Layer (手段層)'
    };
    
    const currentLayerName = layerNames[currentLayer as keyof typeof layerNames] || currentLayer;
    return `Generating ${currentLayerName} - Attempt ${currentAttempt}/3`;
  };

  return {
    isGenerating,
    generateCompleteTree,
    getProgressText,
    currentLayer,
    currentAttempt
  };
};
