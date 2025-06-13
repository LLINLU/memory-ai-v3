
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
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
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

export const useTechnologyTree = (databaseTreeData?: any, viewMode?: "treemap" | "mindmap") => {
  const location = useLocation();
  const locationState = location.state as {
    query?: string;
    scenario?: string;
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    tedResults?: any;
    treeData?: any;
    treeId?: string;
    treeStructure?: any;
    fromDatabase?: boolean;
    fromPreset?: boolean;
  } | null;

  // Get searchMode from location state - default to "quick" if not provided
  const searchMode = locationState?.searchMode || "quick";
  const [selectedView, setSelectedView] = useState("tree");
  
  // Pass isMindmapView to usePathSelection to control auto-selection behavior
  const isMindmapView = viewMode === "mindmap";
  
  // Debug logging
  console.log('useTechnologyTree:', { viewMode, isMindmapView });
  
  // Determine initial path based on TED data availability
  let initialPath = {
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    level7: "",
    level8: "",
    level9: "",
    level10: "",
  };
  
  // Determine which tree data to use: database data takes priority, then location state data
  const treeDataToUse = databaseTreeData || locationState?.treeData;

  // If we have TED-generated data or database data, use the first nodes as initial selection
  if (treeDataToUse?.level1Items?.[0]) {
    const firstLevel1 = treeDataToUse.level1Items[0];
    const firstLevel2 = treeDataToUse.level2Items?.[firstLevel1.id]?.[0];
    const firstLevel3 = firstLevel2
      ? treeDataToUse.level3Items?.[firstLevel2.id]?.[0]
      : null;
    initialPath = {
      level1: firstLevel1.id,
      level2: firstLevel2?.id || "",
      level3: firstLevel3?.id || "",
      level4: "",
      level5: "",
      level6: "",
      level7: "",
      level8: "",
      level9: "",
      level10: "",
    };
  }
  
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
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    showLevel4,
    handleAddLevel4,
  } = usePathSelection(initialPath, treeDataToUse, isMindmapView);

  const {
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    setSidebarTab,
    setShowSidebar,
    toggleSidebar,
  } = useSidebar();

  const {
    inputValue,
    query,
    chatMessages,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue,
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
    scenario: treeDataToUse?.scenario, // Add scenario from database tree data
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
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    handleAddLevel4,
  };
};
