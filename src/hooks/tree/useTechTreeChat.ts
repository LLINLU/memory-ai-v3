
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
        isUser: true,
        type: "text"
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      const aiResponse = processUserMessage(inputValue);
      
      setInputValue("");
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { ...aiResponse, type: "text" }]);
      }, 500);
    }
  };

  const initializeChat = (sidebarTab: string) => {
    if (sidebarTab === 'chat' && chatMessages.length === 0) {
      setChatMessages([
        {
          type: "text",
          content: "I've found research on\nAdaptive Optics → Medical Applications → Retinal Imaging\nHow can I refine this for you?",
          isUser: false
        }
      ]);
    }
  };

  const handleSwitchToChat = (message: string) => {
    setChatMessages([{
      type: "text",
      content: message,
      isUser: false
    }]);
  };

  return {
    inputValue,
    chatMessages,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    setChatMessages
  };
};

