
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTabsHorizontalState } from "@/components/ui/tabs";

interface TechnologyTreeProviderProps {
  children: React.ReactNode;
  setSidebarTab: (tab: string) => void;
  sidebarTab: string;
  initializeChat: (tab: string) => void;
}

export const TechnologyTreeProvider = ({ 
  children, 
  setSidebarTab, 
  sidebarTab, 
  initializeChat 
}: TechnologyTreeProviderProps) => {
  const location = useLocation();
  const locationState = location.state as { 
    conversationHistory?: any[];
  } | null;
  
  // Store the conversation history from the research context
  const [savedConversationHistory, setSavedConversationHistory] = useState<any[]>([]);
  
  // Extract conversation history from location state if available
  useEffect(() => {
    if (locationState?.conversationHistory) {
      setSavedConversationHistory(locationState.conversationHistory);
    }
  }, [locationState]);

  // Set default tabs
  useEffect(() => {
    updateTabsHorizontalState("result"); // Default to result tab
    setSidebarTab("result"); // Set default tab to result
  }, [setSidebarTab]);

  // Initialize chat when sidebar tab changes
  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab, initializeChat]);

  // Update page title
  useEffect(() => {
    document.title = "研究背景を整理します | Technology Tree";
  }, []);

  return <>{children}</>;
};
