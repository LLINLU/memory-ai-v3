
import { useState, useEffect } from "react";
import { processUserMessage } from '@/utils/chatUtils';
import { ChatMessage } from "@/types/chat";

export const useTechTreeChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        content: inputValue,
        isUser: true
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      const aiResponse = processUserMessage(inputValue, searchMode);
      
      setInputValue("");
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, aiResponse]);
      }, 500);
    }
  };

  const initializeChat = (sidebarTab: string) => {
    // Empty implementation to maintain the API
  };

  const handleSwitchToChat = (message: string) => {
    setChatMessages([{
      type: "text",
      content: message,
      isUser: false
    }]);
  };
  
  const handleButtonClick = (action: string) => {
    if (action === 'quick') {
      // Handle quick results action
      setSearchMode("quick");
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "Retrieving quick results for your query...",
          isUser: false
        }
      ]);
      
      // Here you would typically trigger some action to fetch results
      
    } else if (action === 'personalized') {
      // Handle personalized search action
      setSearchMode("deep");
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "Let's personalize your search. What specific aspects of this topic are you most interested in?",
          isUser: false
        }
      ]);
    }
  };

  const handleUseNode = (suggestion) => {
    setChatMessages(prev => [...prev, {
      content: "ノードが作成されました 😊",
      isUser: false,
      showCheckResults: true
    }]);
  };

  return {
    inputValue,
    chatMessages,
    searchMode,
    handleInputChange,
    handleSearchModeChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages,
    handleUseNode
  };
};
