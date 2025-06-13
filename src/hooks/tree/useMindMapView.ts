
import { useState } from "react";

export type ViewMode = "treemap" | "mindmap";

export const useMindMapView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("mindmap");
  
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

  const toggleView = () => {
    setViewMode(prev => prev === "treemap" ? "mindmap" : "treemap");
  };

  const setTreemapView = () => setViewMode("treemap");
  const setMindmapView = () => setViewMode("mindmap");

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
    toggleView,
    setTreemapView,
    setMindmapView,
    getCurrentPath,
    setCurrentPath,
    initializeTreemapPath,
    treemapPath,
    mindmapPath,
  };
};
