
import { useState, useEffect } from "react";
import { processUserMessage } from '@/utils/chatUtils';
import { ChatMessage } from "@/types/chat";
import { toast } from "@/hooks/use-toast";

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
      
      // Fix: processUserMessage only takes one argument
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
    } else if (action === 'generate-scenario') {
      // Handle generate scenario action
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "詳細な研究シナリオを生成しています...",
          isUser: false
        }
      ]);
      
      toast({
        title: "研究シナリオ生成",
        description: "詳細な研究シナリオを生成中です。少々お待ちください。",
      });
      
      // Simulate response after a delay
      setTimeout(() => {
        setChatMessages(prev => {
          // Replace the loading message with the actual response
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            type: "text",
            content: "研究シナリオの生成が完了しました。このテーマについての詳細な研究計画を以下にまとめました...",
            isUser: false
          };
          return updatedMessages;
        });
      }, 2000);
    } else if (action === 'summarize-trends') {
      // Handle summarize trends action
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "最新の研究動向を要約しています...",
          isUser: false
        }
      ]);
      
      toast({
        title: "研究動向の要約",
        description: "最新の研究トレンドを分析中です。少々お待ちください。",
      });
      
      // Simulate response after a delay
      setTimeout(() => {
        setChatMessages(prev => {
          // Replace the loading message with the actual response
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            type: "text",
            content: "このテーマに関する最新の研究動向は以下のとおりです...",
            isUser: false
          };
          return updatedMessages;
        });
      }, 2000);
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
