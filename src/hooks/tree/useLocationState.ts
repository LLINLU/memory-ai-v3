
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface LocationState {
  query?: string; 
  scenario?: string; 
  searchMode?: string;
  researchAnswers?: any;
  conversationHistory?: any[];
  tedResults?: any;
  treeData?: any;
}

export const useLocationState = () => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const [savedConversationHistory, setSavedConversationHistory] = useState<any[]>([]);
  
  // Extract conversation history from location state if available
  useEffect(() => {
    if (locationState?.conversationHistory) {
      setSavedConversationHistory(locationState.conversationHistory);
    }
  }, [locationState]);

  // Initialize tree data with TED results if available
  useEffect(() => {
    if (locationState?.treeData && locationState?.tedResults) {
      console.log('Initializing with TED-generated tree data:', locationState.treeData);
      
      // Show success message with TED evaluation scores
      const tedResults = locationState.tedResults;
      const scores = [];
      if (tedResults.purpose?.evaluation?.total_score) {
        scores.push(`Purpose: ${Math.round(tedResults.purpose.evaluation.total_score / 4)}%`);
      }
      if (tedResults.function?.evaluation?.total_score) {
        scores.push(`Function: ${Math.round(tedResults.function.evaluation.total_score / 4)}%`);
      }
      if (tedResults.measure?.evaluation?.total_score) {
        scores.push(`Measure: ${Math.round(tedResults.measure.evaluation.total_score / 4)}%`);
      }
      
      toast({
        title: "TED Tree Generated Successfully",
        description: `Quality scores: ${scores.join(', ')}`,
      });
    }
  }, [locationState?.treeData, locationState?.tedResults]);

  // Update page title
  useEffect(() => {
    document.title = "研究背景を整理します | Technology Tree";
  }, []);

  return {
    locationState,
    savedConversationHistory
  };
};
