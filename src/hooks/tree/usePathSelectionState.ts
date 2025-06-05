import { useState, useEffect } from "react";
import { PathLevel } from "@/types/tree";

export interface PathState {
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
}

export const usePathSelectionState = (
  initialPath: PathState = {
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
  }
) => {
  const [selectedPath, setSelectedPath] = useState<PathState>(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [treeData, setTreeData] = useState<any>(null);

  // Store tree data for auto-selection
  const updateTreeData = (data: any) => {
    setTreeData(data);
  };

  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    setHasUserMadeSelection(true);

    setSelectedPath((prev) => {
      if (prev[level] === nodeId) {
        // Clear the selected level and all subsequent levels
        const clearedPath = { ...prev };
        const levels: PathLevel[] = [
          "level1",
          "level2",
          "level3",
          "level4",
          "level5",
          "level6",
          "level7",
          "level8",
          "level9",
          "level10",
        ];
        const currentIndex = levels.indexOf(level);
        for (let i = currentIndex; i < levels.length; i++) {
          clearedPath[levels[i]] = "";
        }
        return clearedPath;
      }

      // Set the selected level and clear all subsequent levels, then auto-select first child
      const newPath = { ...prev };
      const levels: PathLevel[] = [
        "level1",
        "level2",
        "level3",
        "level4",
        "level5",
        "level6",
        "level7",
        "level8",
        "level9",
        "level10",
      ];
      const currentIndex = levels.indexOf(level);

      // Clear current and all subsequent levels
      for (let i = currentIndex; i < levels.length; i++) {
        newPath[levels[i]] = "";
      }

      // Set the selected level
      newPath[level] = nodeId;

      // Auto-select first child if available
      if (treeData && currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        const nextLevelKey = `${nextLevel}Items`;
        const childItems = treeData[nextLevelKey]?.[nodeId];

        if (childItems && childItems.length > 0) {
          newPath[nextLevel] = childItems[0].id;

          // Recursively auto-select children
          let currentParentId = childItems[0].id;
          for (let i = currentIndex + 2; i < levels.length; i++) {
            const childLevel = levels[i];
            const childLevelKey = `${childLevel}Items`;
            const grandChildItems = treeData[childLevelKey]?.[currentParentId];

            if (grandChildItems && grandChildItems.length > 0) {
              newPath[childLevel] = grandChildItems[0].id;
              currentParentId = grandChildItems[0].id;
            } else {
              break;
            }
          }
        }
      }

      return newPath;
    });
  };

  const handleAddLevel4 = () => {
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
    handleAddLevel4,
    updateTreeData,
  };
};
