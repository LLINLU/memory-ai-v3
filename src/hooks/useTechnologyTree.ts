
import { useState } from "react";
import { usePathSelection } from "./tree/usePathSelection";
import { useSidebar } from "./tree/useSidebar";
import { useInputQuery } from "./tree/useInputQuery";
import { useNavigationHistory } from "./tree/useNavigationHistory";

export const useTechnologyTree = () => {
  const [selectedView, setSelectedView] = useState("tree");
  const { 
    selectedPath, 
    hasUserMadeSelection, 
    handleNodeClick: originalHandleNodeClick,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items
  } = usePathSelection();
  
  const navigationHistory = useNavigationHistory(selectedPath);

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

  const handleNodeClick = (level: string, nodeId: string) => {
    // Call original handleNodeClick
    originalHandleNodeClick(level, nodeId);
    
    // Add to navigation history
    navigationHistory.addToHistory({
      level1: level === 'level1' ? nodeId : selectedPath.level1,
      level2: level === 'level2' ? nodeId : selectedPath.level2,
      level3: level === 'level3' ? nodeId : selectedPath.level3
    });
  };

  const handleUndo = () => {
    const previousPath = navigationHistory.undo();
    if (previousPath) {
      originalHandleNodeClick('level1', previousPath.level1);
      originalHandleNodeClick('level2', previousPath.level2);
      originalHandleNodeClick('level3', previousPath.level3);
    }
  };

  const handleRedo = () => {
    const nextPath = navigationHistory.redo();
    if (nextPath) {
      originalHandleNodeClick('level1', nextPath.level1);
      originalHandleNodeClick('level2', nextPath.level2);
      originalHandleNodeClick('level3', nextPath.level3);
    }
  };

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
    setInputValue,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items,
    // New navigation methods
    handleUndo,
    handleRedo,
    canUndo: navigationHistory.canUndo,
    canRedo: navigationHistory.canRedo
  };
};
