
import { useChatState } from "./state/useChatState";
import { useChatActions } from "./handlers/useChatActions";
import { useMessageHandlers } from "./handlers/useMessageHandlers";
import { useState } from "react";

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

  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [chatBoxExpanded, setChatBoxExpanded] = useState(false);

  const { handleButtonClick, handleUseNode } = useChatActions(setChatMessages, setIsLoading);
  
  const { handleSendMessage, handleSwitchToChat, initializeChat } = useMessageHandlers(
    inputValue,
    setInputValue,
    setChatMessages,
    setIsLoading
  );

  const initializeWithGuidanceMessages = (type: string) => {
    const guidanceMessages = [];
    
    if (type === 'treemap-usage') {
      guidanceMessages.push(
        {
          content: "ツリーマップの使用方法を教えてください。",
          isUser: true,
          type: 'text'
        },
        {
          content: `🌲 ツリーマップの使い方についてご説明します。
このインターフェースは、ドリルダウン型の階層ツリーマップ構造を使用しています。
各レベルでアイテムを選択すると、以下の2つのことが起こります：
1️⃣ 選択したアイテムが各レベルの最初のアイテムとして自動的に表示され、
2️⃣ 関連するサブカテゴリが次のレベルに表示されます。
選択を重ねることで、データ階層をより深く探索することができます。
各アイテムにマウスをホバーすると、そのアイテムを削除したり、タイトルや説明を編集したりすることができます。
いずれかのレベルで不足しているオプションを見つけた場合は、「追加する」をクリックして追加してください。システムが自動的に、追加されたアイテムに対応する次のレベルのアイテムを生成します。`,
          isUser: false,
          type: 'text'
        }
      );
    }
    
    setChatMessages(guidanceMessages);
  };

  const handleGuidanceClick = (type: string) => {
    // Open and expand the chat
    setChatBoxOpen(true);
    setChatBoxExpanded(true);
    
    // Initialize with guidance messages
    initializeWithGuidanceMessages(type);
  };

  const toggleChatBoxOpen = () => {
    setChatBoxOpen(!chatBoxOpen);
  };

  const toggleChatBoxExpand = () => {
    setChatBoxExpanded(!chatBoxExpanded);
  };

  return {
    inputValue,
    chatMessages,
    searchMode,
    isLoading,
    chatBoxOpen,
    chatBoxExpanded,
    handleInputChange,
    handleSearchModeChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages,
    handleUseNode,
    handleGuidanceClick,
    toggleChatBoxOpen,
    toggleChatBoxExpand
  };
};
