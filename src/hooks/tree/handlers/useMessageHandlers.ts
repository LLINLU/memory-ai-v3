
import { ChatMessage } from "@/types/chat";
import { callChatGPT } from "../services/chatGptService";

export const useMessageHandlers = (
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        content: inputValue,
        isUser: true
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue("");
      
      setIsLoading(true);
      try {
        // Get ChatGPT response
        const aiResponseContent = await callChatGPT(currentInput, 'research');
        
        const aiResponse: ChatMessage = {
          content: aiResponseContent,
          isUser: false,
          type: "text"
        };
        
        setChatMessages(prev => [...prev, aiResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSwitchToChat = (message: string) => {
    setChatMessages([{
      type: "text",
      content: message,
      isUser: false
    }]);
  };

  const initializeChat = (sidebarTab: string) => {
    // Empty implementation to maintain the API
  };

  return {
    handleSendMessage,
    handleSwitchToChat,
    initializeChat
  };
};
