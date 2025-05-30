
import { useEffect, useState } from "react";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { useChatInitialization } from "@/hooks/tree/useChatInitialization";
import { useNodeSelectionEffect } from "@/hooks/tree/useNodeSelectionEffect";
import { toast } from "@/components/ui/use-toast";
import { useTechnologyTreeContext } from "../providers/TechnologyTreeProvider";

interface TechnologyTreeEffectsProps {
  locationState: any;
  savedConversationHistory: any[];
  setShowFallbackAlert: (show: boolean) => void;
}

export const TechnologyTreeEffects: React.FC<TechnologyTreeEffectsProps> = ({
  locationState,
  savedConversationHistory,
  setShowFallbackAlert
}) => {
  const {
    selectedPath,
    setShowSidebar,
    setSidebarTab,
    chatMessages,
    setChatMessages,
    handleSwitchToChat,
    initializeChat,
    sidebarTab
  } = useTechnologyTreeContext();

  useEffect(() => {
    if (locationState?.treeData && locationState?.tedResults) {
      console.log('Initializing with TED-generated tree data:', locationState.treeData);
      
      const tedResults = locationState.tedResults;
      let hasFallbackData = false;
      
      if (tedResults.purpose?.layer?.generation_metadata?.coverage_note?.includes('Fallback') ||
          tedResults.function?.layer?.generation_metadata?.coverage_note?.includes('Fallback') ||
          tedResults.measure?.layer?.generation_metadata?.coverage_note?.includes('Fallback')) {
        hasFallbackData = true;
        setShowFallbackAlert(true);
      }
      
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
        title: hasFallbackData ? "TED Tree Generated with Templates" : "TED Tree Generated Successfully",
        description: scores.length > 0 ? `Quality scores: ${scores.join(', ')}` : "Tree structure created successfully",
      });
    }
  }, [locationState?.treeData, locationState?.tedResults, setShowFallbackAlert]);

  useChatInitialization({
    locationState,
    chatMessages,
    setChatMessages,
    handleSwitchToChat
  });

  useNodeSelectionEffect({
    selectedPath,
    setShowSidebar,
    setSidebarTab
  });

  useEffect(() => {
    updateTabsHorizontalState("result");
    setSidebarTab("result");
  }, [setSidebarTab]);

  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab, initializeChat]);

  useEffect(() => {
    document.title = "研究背景を整理します | Technology Tree";
  }, []);

  return null;
};
