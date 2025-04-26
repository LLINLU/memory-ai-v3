
import React, { useState, useEffect } from "react";

export interface TechnologyTreeState {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  selectedView: string;
  sidebarTab: string;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  inputValue: string;
  query?: string;
  hasUserMadeSelection: boolean;
}

// Separate hook for path selection
export const usePathSelection = (initialPath = {
  level1: "adaptive-optics",
  level2: "medical-applications",
  level3: "retinal-imaging"
}) => {
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);

  const handleNodeClick = (level: string, nodeId: string) => {
    setHasUserMadeSelection(true);
    
    setSelectedPath(prev => {
      if (prev[level] === nodeId) {
        if (level === 'level1') {
          return { ...prev, level1: "", level2: "", level3: "" };
        } else if (level === 'level2') {
          return { ...prev, level2: "", level3: "" };
        } else if (level === 'level3') {
          return { ...prev, level3: "" };
        }
      }
      
      if (level === 'level1') {
        return { ...prev, level1: nodeId, level2: "", level3: "" };
      } else if (level === 'level2') {
        return { ...prev, level2: nodeId, level3: "" };
      } else if (level === 'level3') {
        return { ...prev, level3: nodeId };
      }
      return prev;
    });
  };

  return {
    selectedPath,
    hasUserMadeSelection,
    handleNodeClick
  };
};

// Separate hook for sidebar management
export const useSidebar = (initialTab = "result") => {
  const [sidebarTab, setSidebarTab] = useState(initialTab);
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);

  const toggleSidebar = () => {
    if (collapsedSidebar) {
      setCollapsedSidebar(false);
      setShowSidebar(true);
    } else {
      setCollapsedSidebar(true);
    }
  };

  return {
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    setSidebarTab,
    setShowSidebar,
    toggleSidebar
  };
};

// Separate hook for input and query management
export const useInputQuery = (sidebarTab: string) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    // Only initialize chat messages if we're in the chat tab and no messages exist
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
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue
  };
};

// Main hook that combines all the others
export const useTechnologyTree = () => {
  const [selectedView, setSelectedView] = useState("tree");
  const { selectedPath, hasUserMadeSelection, handleNodeClick } = usePathSelection();
  const { sidebarTab, showSidebar, collapsedSidebar, setSidebarTab, setShowSidebar, toggleSidebar } = useSidebar();
  const { 
    inputValue, 
    query, 
    chatMessages, 
    handleInputChange, 
    setQuery, 
    setChatMessages,
    setInputValue 
  } = useInputQuery(sidebarTab);

  return {
    selectedPath,
    selectedView,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    inputValue,
    query,
    chatMessages,
    hasUserMadeSelection,
    setSelectedView,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue
  };
};
