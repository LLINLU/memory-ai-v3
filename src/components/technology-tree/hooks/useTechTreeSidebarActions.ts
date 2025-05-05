
import { useState } from "react";
import { NodeSuggestion, ChatMessage } from "@/types/chat";

export const useTechTreeSidebarActions = (
  setChatMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void,
  addCustomNode: (level: string, suggestion: NodeSuggestion) => void,
  setSidebarTab: (tab: string) => void
) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckResults = () => {
    console.log("Check Results button clicked, switching to result tab");
    setSidebarTab("result");
    
    // Also trigger a refresh of the papers
    const refreshEvent = new CustomEvent('refresh-papers', {
      detail: { source: 'checkResults', timestamp: Date.now() }
    });
    document.dispatchEvent(refreshEvent);
  };

  const handleUseNode = (suggestion: NodeSuggestion) => {
    if (!suggestion) return;

    const findLevel = (messages: ChatMessage[]) => {
      // Try to find a message that mentions a level
      for (const message of messages) {
        const levelMatch = message.content?.match(/Level (\d+)/i);
        if (levelMatch) {
          const levelNum = levelMatch[1];
          return `level${levelNum}`;
        }
      }
      return 'level2'; // Default to level2 if no specific level found
    };

    setChatMessages(prev => {
      const level = findLevel(prev);
      console.log(`Adding custom node to ${level}:`, suggestion);
      addCustomNode(level, suggestion);

      return [...prev, {
        content: "The node has been created 😊",
        isUser: false,
        showCheckResults: true
      }];
    });
  };

  const handleEditNodeFromChat = (suggestion: NodeSuggestion) => {
    if (!suggestion) return;
    
    setChatMessages(prev => {
      const level = findLevel(prev);
      addCustomNode(level, suggestion);
      return prev;
    });
  };

  const handleRefineNode = (suggestion: NodeSuggestion) => {
    if (!suggestion) return;
    
    // Add more detailed prompt for refinement
    setChatMessages(prev => [
      ...prev,
      {
        content: `I'll help you refine this node further. What specific aspects would you like to develop about "${suggestion.title}"?`,
        isUser: false
      }
    ]);
  };

  const findLevel = (messages: ChatMessage[]) => {
    // Try to find a message that mentions a level
    for (const message of messages) {
      const levelMatch = message.content?.match(/Level (\d+)/i);
      if (levelMatch) {
        const levelNum = levelMatch[1];
        return `level${levelNum}`;
      }
    }
    return 'level2'; // Default to level2 if no specific level found
  };

  return {
    isExpanded,
    toggleExpand,
    handleCheckResults,
    handleUseNode,
    handleEditNodeFromChat,
    handleRefineNode,
  };
};
