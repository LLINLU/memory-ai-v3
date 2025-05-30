
import { useState } from "react";
import { ChatMessage } from "@/types/chat";

export const useChatState = () => {
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

  return {
    inputValue,
    setInputValue,
    chatMessages,
    setChatMessages,
    searchMode,
    setSearchMode,
    isLoading,
    setIsLoading,
    handleInputChange,
    handleSearchModeChange
  };
};
