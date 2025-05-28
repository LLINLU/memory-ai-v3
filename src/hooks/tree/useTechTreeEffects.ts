
import { useEffect } from "react";
import { updateTabsHorizontalState } from "@/components/ui/tabs";

interface TechTreeEffectsProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  initializeChat: (tab: string) => void;
  selectedPath: any;
  setShowSidebar: (show: boolean) => void;
  chatMessages: any[];
  setChatMessages: (messages: any[]) => void;
  handleSwitchToChat: () => void;
  locationState: any;
}

export const useTechTreeEffects = ({
  sidebarTab,
  setSidebarTab,
  initializeChat,
  selectedPath,
  setShowSidebar,
  chatMessages,
  setChatMessages,
  handleSwitchToChat,
  locationState
}: TechTreeEffectsProps) => {
  
  // Set default tabs
  useEffect(() => {
    updateTabsHorizontalState("result");
    setSidebarTab("result");
  }, [setSidebarTab]);

  // Initialize chat when sidebar tab changes
  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab, initializeChat]);

  // Handle node selection effects
  useEffect(() => {
    if (selectedPath.level3) {
      setShowSidebar(true);
      setSidebarTab("result");
      
      // Dispatch an event to refresh paper list with the selected node
      const event = new CustomEvent('refresh-papers', {
        detail: { nodeId: selectedPath.level3 }
      });
      document.dispatchEvent(event);
    }
  }, [selectedPath.level3, setShowSidebar, setSidebarTab]);

  // Initialize chat with context data
  useEffect(() => {
    if (locationState?.conversationHistory && chatMessages.length === 0) {
      setChatMessages(locationState.conversationHistory);
      handleSwitchToChat();
    }
  }, [locationState, chatMessages, setChatMessages, handleSwitchToChat]);
};
