
import { useState } from "react";
import { usePathSelection } from "./tree/usePathSelection";
import { useSidebar } from "./tree/useSidebar";
import { useInputQuery } from "./tree/useInputQuery";
import { useLocation } from "react-router-dom";

export interface TechnologyTreeState {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  selectedView: string;
  sidebarTab: string;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  inputValue: string;
  query?: string;
  hasUserMadeSelection: boolean;
  showLevel4?: boolean;
  searchMode?: string;
}

export const useTechnologyTree = () => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string; 
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    tedResults?: any;
    treeData?: any;
  } | null;
  
  // Get searchMode from location state - default to "quick" if not provided
  const searchMode = locationState?.searchMode || "quick";
  const [selectedView, setSelectedView] = useState("tree");
  
  // Always start with empty initial path - let usePathSelection determine the correct path
  const initialPath = {
    level1: "",
    level2: "",
    level3: "",
    level4: ""
  };
  
  const { 
    selectedPath, 
    hasUserMadeSelection, 
    handleNodeClick, 
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    showLevel4,
    handleAddLevel4
  } = usePathSelection(initialPath, locationState?.treeData);
  
  const { 
    sidebarTab, 
    showSidebar, 
    collapsedSidebar, 
    setSidebarTab, 
    setShowSidebar, 
    toggleSidebar 
  } = useSidebar();
  
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
    showLevel4,
    searchMode,
    setSelectedView,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue,
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    handleAddLevel4
  };
};
