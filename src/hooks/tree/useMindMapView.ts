
import { useState } from "react";

export type ViewMode = "treemap" | "mindmap";

export const useMindMapView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("mindmap");
  const [justSwitchedView, setJustSwitchedView] = useState(false);
  
  // Separate path states for each view
  const [treemapPath, setTreemapPath] = useState({
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
  });
  
  const [mindmapPath, setMindmapPath] = useState({
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
  });

  // Synchronize paths between views
  const synchronizePaths = (fromView: ViewMode, toView: ViewMode) => {
    if (fromView === "treemap" && toView === "mindmap") {
      setMindmapPath({ ...treemapPath });
    } else if (fromView === "mindmap" && toView === "treemap") {
      setTreemapPath({ ...mindmapPath });
    }
  };

  const toggleView = () => {
    const currentView = viewMode;
    const targetView = viewMode === "treemap" ? "mindmap" : "treemap";
    
    // Synchronize paths before switching
    synchronizePaths(currentView, targetView);
    
    setViewMode(targetView);
    setJustSwitchedView(true);
  };

  const setTreemapView = () => {
    if (viewMode !== "treemap") {
      synchronizePaths(viewMode, "treemap");
      setViewMode("treemap");
      setJustSwitchedView(true);
    }
  };

  const setMindmapView = () => {
    if (viewMode !== "mindmap") {
      synchronizePaths(viewMode, "mindmap");
      setViewMode("mindmap");
      setJustSwitchedView(true);
    }
  };

  // Function to clear the switch flag
  const clearViewSwitchFlag = () => {
    setJustSwitchedView(false);
  };

  // Get the path for the current view
  const getCurrentPath = () => {
    return viewMode === "treemap" ? treemapPath : mindmapPath;
  };

  // Set the path for the current view
  const setCurrentPath = (newPath: typeof treemapPath) => {
    if (viewMode === "treemap") {
      setTreemapPath(newPath);
    } else {
      setMindmapPath(newPath);
    }
  };

  // Initialize treemap path with auto-selection when tree data is available
  const initializeTreemapPath = (treeData: any) => {
    if (!treeData?.level1Items?.[0]) return;
    
    const firstLevel1 = treeData.level1Items[0];
    const firstLevel2 = treeData.level2Items?.[firstLevel1.id]?.[0];
    const firstLevel3 = firstLevel2 ? treeData.level3Items?.[firstLevel2.id]?.[0] : null;
    
    setTreemapPath({
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
    });
  };

  return {
    viewMode,
    isTreemapView: viewMode === "treemap",
    isMindmapView: viewMode === "mindmap",
    justSwitchedView,
    toggleView,
    setTreemapView,
    setMindmapView,
    clearViewSwitchFlag,
    getCurrentPath,
    setCurrentPath,
    initializeTreemapPath,
    treemapPath,
    mindmapPath,
  };
};
