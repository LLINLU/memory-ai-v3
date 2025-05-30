
import { ChatMessage } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { callChatGPT } from "../services/chatGptService";

export const useChatActions = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleButtonClick = async (action: string, levelNumber?: string) => {
    setIsLoading(true);
    
    try {
      if (action === 'quick') {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseNode = (suggestion: any) => {
    setChatMessages(prev => [...prev, {
      content: "ノードが作成されました 😊",
      isUser: false,
      showCheckResults: true
    }]);
  };

  return {
    handleButtonClick,
    handleUseNode
  };
};
