
import { useState } from "react";

export interface PathState {
  level1: string;
  level2: string;
  level3: string;
}

export const usePathSelectionState = (initialPath: PathState = {
  level1: "astronomy",
  level2: "turbulence-compensation",
  level3: "laser-guide-star"
}) => {
  const [selectedPath, setSelectedPath] = useState<PathState>(initialPath);
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
    setSelectedPath,
    hasUserMadeSelection,
    setHasUserMadeSelection,
    handleNodeClick
  };
};
