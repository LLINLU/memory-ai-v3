
import { useState, useEffect } from "react";
import { processUserMessage } from '@/utils/chatUtils';
import { ChatMessage } from "@/types/chat";

export const useTechTreeChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        content: inputValue,
        isUser: true
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      const aiResponse = processUserMessage(inputValue);
      
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

  return {
    inputValue,
    chatMessages,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages
  };
};
