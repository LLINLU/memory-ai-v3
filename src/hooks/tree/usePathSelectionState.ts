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
  },
  disableAutoSelection = false
) => {
  const [selectedPath, setSelectedPath] = useState<PathState>(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [treeData, setTreeData] = useState<any>(null);

  // NEW: Track the node that user actually clicked for sidebar display
  const [userClickedNode, setUserClickedNode] = useState<{
    level: PathLevel;
    nodeId: string;
  } | null>(null);

  // Debug logging
  //console.log('usePathSelectionState: disableAutoSelection =', disableAutoSelection);

  // Store tree data for auto-selection
  const updateTreeData = (data: any) => {
    setTreeData(data);
  };

  // Helper function to find the complete path for a node in mindmap mode
  const findCompletePath = (
    targetLevel: PathLevel,
    targetNodeId: string
  ): PathState => {
    if (!treeData) return initialPath;

    const newPath: PathState = {
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

    const targetLevelIndex = levels.indexOf(targetLevel);

    if (targetLevelIndex === 0) {
      // Level 1 node - just set it directly
      newPath.level1 = targetNodeId;
      return newPath;
    }

    // For level 2+ nodes, we need to traverse up to find parents
    let currentNodeId = targetNodeId;
    let currentLevelIndex = targetLevelIndex;

    // Set the target level first
    newPath[targetLevel] = targetNodeId;

    // Work backwards to find parent nodes
    while (currentLevelIndex > 0) {
      const currentLevel = levels[currentLevelIndex];
      const parentLevel = levels[currentLevelIndex - 1];

      // Find the parent of the current node
      let parentNodeId = "";

      if (currentLevelIndex === 1) {
        // For level 2 nodes, find which level 1 node contains this level 2 node
        const level1Items = treeData.level1Items || [];
        for (const level1Item of level1Items) {
          const level2Children = treeData.level2Items?.[level1Item.id] || [];
          if (level2Children.find((child: any) => child.id === currentNodeId)) {
            parentNodeId = level1Item.id;
            break;
          }
        }
      } else if (currentLevelIndex === 2) {
        // For level 3 nodes, find which level 2 node contains this level 3 node
        for (const [level1Id, level2Children] of Object.entries(treeData.level2Items || {})) {
          if (Array.isArray(level2Children)) {
            for (const level2Child of level2Children) {
              const level3Children = treeData.level3Items?.[level2Child.id] || [];
              if (level3Children.find((child: any) => child.id === currentNodeId)) {
                parentNodeId = level2Child.id;
                break;
              }
            }
            if (parentNodeId) break;
          }
        }
      } else if (currentLevelIndex === 3) {
        // For level 4 nodes, find which level 3 node contains this level 4 node
        for (const [level2Id, level3Children] of Object.entries(treeData.level3Items || {})) {
          if (Array.isArray(level3Children)) {
            for (const level3Child of level3Children) {
              const level4Children = treeData.level4Items?.[level3Child.id] || [];
              if (level4Children.find((child: any) => child.id === currentNodeId)) {
                parentNodeId = level3Child.id;
                break;
              }
            }
            if (parentNodeId) break;
          }
        }
      } else if (currentLevelIndex === 4) {
        // For level 5 nodes, find which level 4 node contains this level 5 node
        for (const [level3Id, level4Children] of Object.entries(treeData.level4Items || {})) {
          if (Array.isArray(level4Children)) {
            for (const level4Child of level4Children) {
              const level5Children = treeData.level5Items?.[level4Child.id] || [];
              if (level5Children.find((child: any) => child.id === currentNodeId)) {
                parentNodeId = level4Child.id;
                break;
              }
            }
            if (parentNodeId) break;
          }
        }
      } else {
        // For level 6+ nodes, use the original logic
        const parentLevelKey = `${parentLevel}Items`;
        const parentLevelItems = treeData[parentLevelKey] || {};
        for (const [parentId, children] of Object.entries(parentLevelItems)) {
          if (
            Array.isArray(children) &&
            children.find((child: any) => child.id === currentNodeId)
          ) {
            parentNodeId = parentId;
            break;
          }
        }
      }

      if (parentNodeId) {
        newPath[parentLevel] = parentNodeId;
        currentNodeId = parentNodeId;
        currentLevelIndex--;
      } else {
        console.warn(
          `Could not find parent for ${currentLevel} node ${currentNodeId}`
        );
        break;
      }
    }

    //console.log('Mindmap: Built complete path:', newPath);
    return newPath;
  };

  // Auto-select first path through the entire tree when tree data is loaded
  // BUT only if auto-selection is not disabled (i.e., not in mindmap view)
  useEffect(() => {
    // console.log('Auto-selection effect triggered:', {
    //   disableAutoSelection,
    //   hasTreeData: !!treeData,
    //   hasUserMadeSelection,
    //   hasLevel1Items: !!(treeData?.level1Items?.length)
    // });

    if (
      disableAutoSelection ||
      !treeData ||
      hasUserMadeSelection ||
      !treeData.level1Items ||
      treeData.level1Items.length === 0
    ) {
      console.log("Skipping auto-selection due to conditions");
      return;
    }

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
      //console.log('Auto-selecting first path for treemap view');
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
  }, [treeData, hasUserMadeSelection, disableAutoSelection]);
  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    console.log("Node clicked:", { level, nodeId, disableAutoSelection });
    setHasUserMadeSelection(true);

    // Track the user's actual click for sidebar display
    setUserClickedNode({ level, nodeId });

    // Scroll to top of the page when a node is selected
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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

      // MINDMAP MODE: Build complete path by traversing up the tree
      if (disableAutoSelection) {
        console.log("Mindmap mode: Building complete path for", level, nodeId);
        return findCompletePath(level, nodeId);
      }

      // TREEMAP MODE: Auto-selection enabled
      console.log("Treemap mode: Auto-selection enabled for", level, nodeId);
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

      // Auto-select children for treemap view
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
    userClickedNode, // NEW: Expose the user's actual clicked node
  };
};
