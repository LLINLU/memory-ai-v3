
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
  
  const handleButtonClick = async (action: string, levelNumber?: string) => {
    if (action === 'quick') {
      setSearchMode("quick");
      const response = await callChatGPT("研究に関するクイック検索結果を提供してください。", 'research');
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: response,
          isUser: false
        }
      ]);
      
    } else if (action === 'personalized') {
      setSearchMode("deep");
      const response = await callChatGPT("この研究トピックについて、より詳細で個別化された情報を提供してください。どのような特定の側面に最も興味がありますか？", 'research');
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: response,
          isUser: false
        }
      ]);
    } else if (action === 'generate-scenario') {
      const response = await callChatGPT("研究シナリオを作成するために、まず取り組みたい課題や現象について教えてください。具体的には何について研究されていますか？", 'research');
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: response,
          isUser: false
        }
      ]);
      
      toast({
        title: "研究シナリオ生成",
        description: "詳細な研究シナリオを生成中です。少々お待ちください。",
      });
    } else if (action === 'summarize-trends') {
      const response = await callChatGPT("最新の研究動向を要約してください。現在の技術トレンドと重要な研究領域について説明してください。", 'research');
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: response,
          isUser: false
        }
      ]);
      
      toast({
        title: "研究動向の要約",
        description: "最新の研究トレンドを分析中です。少々お待ちください。",
      });
    } else if (action === 'generate-node') {
      const dynamicLevelNumber = levelNumber || '2'; // Default to 2 if not provided
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: `👋 新しいノードを作成しましょう

レベル${dynamicLevelNumber}の下に追加するノードを作成します。

以下の2つの簡単な方法があります：`,
          isUser: false,
          buttons: [
            {
              label: "📝 直接入力",
              action: "direct-input",
              primary: true
            },
            {
              label: "💭 アイデア共有", 
              action: "idea-sharing",
              primary: false
            }
          ]
        }
      ]);
    } else if (action === 'direct-input') {
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "📝 直接入力\n\nタイトルと説明をそのまま教えてください",
          isUser: false
        }
      ]);
    } else if (action === 'idea-sharing') {
      setChatMessages(prev => [
        ...prev,
        {
          type: "text",
          content: "💭 アイデア共有\n\n考えを自然に話してください。私が整理します！",
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
