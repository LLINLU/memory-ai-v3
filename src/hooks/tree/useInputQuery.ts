
import { useState, useEffect } from "react";

export const useInputQuery = (sidebarTab: string) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
  };

  useEffect(() => {
    if (sidebarTab === 'chat' && chatMessages.length === 0) {
      setChatMessages([
        {
          type: "agent",
          content: "I've found research on\nAdaptive Optics → Medical Applications → Retinal Imaging\nHow can I refine this for you?",
          isUser: false
        }
      ]);
    }
  }, [sidebarTab, chatMessages.length]);

  return {
    inputValue,
    query,
    chatMessages,
    searchMode,
    handleInputChange,
    handleSearchModeChange,
    setQuery,
    setChatMessages,
    setInputValue,
    setSearchMode
  };
};
