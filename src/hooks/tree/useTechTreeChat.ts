
import { useChatState } from "./state/useChatState";
import { useChatActions } from "./handlers/useChatActions";
import { useMessageHandlers } from "./handlers/useMessageHandlers";

export const useTechTreeChat = () => {
  const {
    inputValue,
    setInputValue,
    chatMessages,
    setChatMessages,
    searchMode,
    isLoading,
    setIsLoading,
    handleInputChange,
    handleSearchModeChange
  } = useChatState();

  const { handleButtonClick, handleUseNode } = useChatActions(setChatMessages, setIsLoading);
  
  const { handleSendMessage, handleSwitchToChat, initializeChat } = useMessageHandlers(
    inputValue,
    setInputValue,
    setChatMessages,
    setIsLoading
  );

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
