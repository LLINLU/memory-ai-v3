
import { useState, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTechTreeChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchMode, setSearchMode] = useState("quick");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
  };
  
  const callChatGPT = async (message: string, context: string = 'research') => {
    try {
      setIsLoading(true);
      console.log('Calling ChatGPT with message:', message);

      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: { message, context }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('ChatGPT response:', data);
      return data.response;
    } catch (error) {
      console.error('Error calling ChatGPT:', error);
      toast({
        title: "エラー",
        description: "ChatGPTからの応答を取得できませんでした。もう一度お試しください。",
      });
      return "申し訳ございませんが、現在応答を生成できません。もう一度お試しください。";
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        content: inputValue,
        isUser: true
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue("");
      
      // Get ChatGPT response
      const aiResponseContent = await callChatGPT(currentInput, 'research');
      
      const aiResponse: ChatMessage = {
        content: aiResponseContent,
        isUser: false,
        type: "text"
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
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
  
  const handleButtonClick = async (action: string) => {
    // Empty implementation - ready for future content
    console.log('Button clicked:', action);
  };

  const handleUseNode = (suggestion) => {
    // Empty implementation - ready for future content
    console.log('Use node:', suggestion);
  };

  return {
    inputValue,
    chatMessages,
    searchMode,
    isLoading,
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
