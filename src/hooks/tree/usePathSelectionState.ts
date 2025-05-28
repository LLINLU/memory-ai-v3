
import { useState } from "react";
import { PathLevel } from "@/types/tree";

export interface PathState {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export const usePathSelectionState = (initialPath: PathState = {
  level1: "astronomy",
  level2: "turbulence-compensation",
  level3: "laser-guide-star",
  level4: ""
}) => {
  const [selectedPath, setSelectedPath] = useState<PathState>(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);
  const [showLevel4, setShowLevel4] = useState(true); // Always show level4 now

  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    setHasUserMadeSelection(true);
    
    setSelectedPath(prev => {
      if (prev[level] === nodeId) {
        if (level === 'level1') {
          return { ...prev, level1: "", level2: "", level3: "", level4: "" };
        } else if (level === 'level2') {
          return { ...prev, level2: "", level3: "", level4: "" };
        } else if (level === 'level3') {
          return { ...prev, level3: "", level4: "" };
        } else if (level === 'level4') {
          return { ...prev, level4: "" };
        }
      }
      
      if (level === 'level1') {
        return { ...prev, level1: nodeId, level2: "", level3: "", level4: "" };
      } else if (level === 'level2') {
        return { ...prev, level2: nodeId, level3: "", level4: "" };
      } else if (level === 'level3') {
        return { ...prev, level3: nodeId, level4: "" };
      } else if (level === 'level4') {
        return { ...prev, level4: nodeId };
      }
      return prev;
    });
  };

  const handleAddLevel4 = () => {
    // Level 4 is always shown now, this function can remain for compatibility
    setShowLevel4(true);
  };

  return {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    setHasUserMadeSelection,
    handleNodeClick,
    showLevel4,
    setShowLevel4,
    handleAddLevel4
  };
};
