
import { useState } from "react";

export type ViewMode = "treemap" | "mindmap";

export const useMindMapView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("treemap");

  const toggleView = () => {
    setViewMode(prev => prev === "treemap" ? "mindmap" : "treemap");
  };

  const setTreemapView = () => setViewMode("treemap");
  const setMindmapView = () => setViewMode("mindmap");

  return {
    viewMode,
    isTreemapView: viewMode === "treemap",
    isMindmapView: viewMode === "mindmap",
    toggleView,
    setTreemapView,
    setMindmapView,
  };
};
