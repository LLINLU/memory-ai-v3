
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
    
    if (type === 'mindmap-usage') {
      guidanceMessages.push(
        {
          content: "Mindmapの使用方法を教えてください。",
          isUser: true,
          type: 'text'
        },
        {
          content: `インタラクティブなマインドマップを閲覧して、さまざまなテクノロジーを発見してください。使い方は以下の通りです：

1️⃣ テクノロジーノードをクリックすると、右パネルに関連する研究論文実際の使用例が表示されます。

2️⃣ もっと見たいですか？ お客様の興味に基づいて、追加のテクノロジーノードを生成することができます。`,
          isUser: false,
          type: 'text'
        }
      );
    } else if (type === 'treemap-usage') {
      guidanceMessages.push(
        {
          content: "ツリーマップの使用方法を教えてください。",
          isUser: true,
          type: 'text'
        },
        {
          content: `🌲 ツリーマップの使い方についてご説明します。
このインターフェースは、ドリルダウン型の階層ツリーマップ構造を使用しています。
各レベルでアイテムを選択すると、以下の3つのことが起こります：
1️⃣ 選択したアイテムが各レベルの一番上に移動して表示されます。
2️⃣ 関連するサブカテゴリが次のレベルに表示されます。
3️⃣ 右パネルの論文と事例が、選択したアイテムに対応してリアルタイムで更新されます。
選択を重ねることで、データ階層をより深く探索することができます。
各アイテムにマウスをホバーすると、そのアイテムを削除したり、タイトルや説明を編集したりすることができます。
いずれかのレベルで不足しているオプションを見つけた場合は、「追加する」をクリックして追加してください。システムが自動的に、追加されたアイテムに対応する次のレベルのアイテムを生成します。`,
          isUser: false,
          type: 'text'
        }
      );
    } else if (type === 'scenario-editing') {
      guidanceMessages.push(
        {
          content: "こんにちは！研究シナリオを更新されたいですか？お手伝いできます。シナリオが更新されると、ツリーマップも自動的に更新されます。",
          isUser: false,
          type: 'text'
        }
      );
    } else if (type === 'node-creation') {
      guidanceMessages.push(
        {
          content: "新しいノードの作成を手伝ってほしいです。",
          isUser: true,
          type: 'text'
        },
        {
          content: "🙌 喜んでお手伝いします！どんなアイデアでも自然な言葉で教えてください。きちんと構造化されたノードに整理いたします！",
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
