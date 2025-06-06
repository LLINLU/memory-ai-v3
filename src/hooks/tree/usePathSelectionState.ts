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
  }; // Auto-select first path through the entire tree when tree data is loaded
  useEffect(() => {
    if (
      treeData &&
      !hasUserMadeSelection &&
      treeData.level1Items &&
      treeData.level1Items.length > 0
    ) {
      // Only auto-select if current path is empty or invalid
      const firstLevel1 = treeData.level1Items[0];
      const currentLevel1Exists = treeData.level1Items.find(
        (item: any) => item.id === selectedPath.level1
      );

      // Trigger auto-selection if:
      // 1. No level1 is selected, OR
      // 2. Current level1 doesn't exist in tree data, OR
      // 3. Level1 is selected but level2 is empty (need cascade)
      if (
        !selectedPath.level1 ||
        !currentLevel1Exists ||
        (selectedPath.level1 && !selectedPath.level2)
      ) {
        // Trigger the same logic as manual click to ensure cascade works
        setSelectedPath((prev) => {
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

          // Clear all levels first
          for (let i = 0; i < levels.length; i++) {
            newPath[levels[i]] = "";
          }

          // Set level 1
          newPath.level1 = firstLevel1.id;

          // Auto-select children using the same logic as handleNodeClick
          let currentParentId = firstLevel1.id;
          for (let i = 1; i < levels.length; i++) {
            const level = levels[i];
            const levelKey = `${level}Items`;
            const childItems = treeData[levelKey]?.[currentParentId];

            if (childItems && childItems.length > 0) {
              newPath[level] = childItems[0].id;
              currentParentId = childItems[0].id;
            } else {
              break;
            }
          }

          return newPath;
        });
      }
    }
  }, [treeData, hasUserMadeSelection]);
  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    setHasUserMadeSelection(true);

    // Scroll to top of the page when a node is selected
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

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
