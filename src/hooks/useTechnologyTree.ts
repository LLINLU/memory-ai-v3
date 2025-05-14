
import { useState } from "react";
import { usePathSelection } from "./tree/usePathSelection";
import { useSidebar } from "./tree/useSidebar";
import { useInputQuery } from "./tree/useInputQuery";

export interface TechnologyTreeState {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  };
  selectedView: string;
  sidebarTab: string;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  inputValue: string;
  query?: string;
  hasUserMadeSelection: boolean;
  showLevel4?: boolean;
}

export const useTechnologyTree = () => {
  const [selectedView, setSelectedView] = useState("tree");
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
  } = usePathSelection();
  
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
