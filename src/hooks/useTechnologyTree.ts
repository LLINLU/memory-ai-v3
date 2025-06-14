import { useState, useEffect } from "react";
import { usePathSelection } from "./tree/usePathSelection";
import { useSidebar } from "./tree/useSidebar";
import { useInputQuery } from "./tree/useInputQuery";
import { useLocation } from "react-router-dom";
import { PathLevel } from "@/types/tree";

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

export const useTechnologyTree = (
  databaseTreeData?: any,
  viewModeHook?: any
) => {
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

  // Use view mode hook if provided
  const viewMode = viewModeHook?.viewMode || "mindmap";
  const isMindmapView = viewMode === "mindmap";

  // Determine which tree data to use: database data takes priority, then location state data
  const treeDataToUse = databaseTreeData || locationState?.treeData;

  // Debug: Log when tree data changes
  useEffect(() => {
    if (databaseTreeData) {
      console.log("useTechnologyTree: databaseTreeData updated", {
        level1Count: databaseTreeData.level1Items?.length || 0,
        level2Keys: Object.keys(databaseTreeData.level2Items || {}),
        timestamp: databaseTreeData._timestamp,
      });
    }
  }, [databaseTreeData]);

  // Get the current path from the view mode hook or use default
  const getCurrentPath =
    viewModeHook?.getCurrentPath ||
    (() => ({
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
    }));

  const initialPath = getCurrentPath();

  // Track if treemap initialization has been done to prevent infinite loops
  const [treemapInitialized, setTreemapInitialized] = useState(false);

  // Initialize treemap path only once when switching to treemap view and we have data
  useEffect(() => {
    if (
      !isMindmapView &&
      treeDataToUse?.level1Items?.[0] &&
      viewModeHook?.initializeTreemapPath &&
      !treemapInitialized
    ) {
      //console.log('Treemap mode: Initializing auto-selected path');
      viewModeHook.initializeTreemapPath(treeDataToUse);
      setTreemapInitialized(true);
    }

    // Reset initialization flag when switching to mindmap
    if (isMindmapView && treemapInitialized) {
      setTreemapInitialized(false);
    }
  }, [isMindmapView, treeDataToUse, viewModeHook, treemapInitialized]);

  const {
    selectedPath,
    hasUserMadeSelection,
    handleNodeClick: originalHandleNodeClick,
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

  // Wrap the handleNodeClick to update the view-specific path
  const handleNodeClick = (level: string, nodeId: string) => {
    originalHandleNodeClick(level as PathLevel, nodeId);

    // If we have the view mode hook, update the current view's path
    if (viewModeHook?.setCurrentPath) {
      // Get the updated path after the click
      setTimeout(() => {
        // This will be called after the path state has been updated
        const updatedPath = getCurrentPath();
        viewModeHook.setCurrentPath(updatedPath);
      }, 0);
    }
  };

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
