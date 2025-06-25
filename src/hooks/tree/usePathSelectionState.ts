import { useEffect } from "react";
import { PathLevel } from "@/types/tree";
import { usePathState, PathState } from "./state/usePathState";
import { useNodeClickHandler } from "./handlers/useNodeClickHandler";
import { autoSelectChildren } from "./utils/pathUtils";

export { type PathState } from "./state/usePathState";

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
  const {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    setHasUserMadeSelection,
    showLevel4,
    setShowLevel4,
    treeData,
    userClickedNode,
    setUserClickedNode,
    updateTreeData,
    handleAddLevel4,
  } = usePathState(initialPath);

  const { handleNodeClick } = useNodeClickHandler(
    disableAutoSelection,
    treeData,
    initialPath,
    setSelectedPath,
    setHasUserMadeSelection,
    setUserClickedNode
  );

  // Auto-select first path through the entire tree when tree data is loaded
  // BUT only if auto-selection is not disabled (i.e., not in mindmap view)
  useEffect(() => {
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
    ); // Trigger auto-selection if:
    // 1. No level1 is selected, OR
    // 2. Current level1 doesn't exist in tree data
    // Note: Removed the level2 check to prevent auto-cascading to children
    if (!selectedPath.level1 || !currentLevel1Exists) {
      // Only auto-select the level 1 node, don't cascade to children
      setSelectedPath((prev) => {
        let newPath = { ...prev };
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

        // Set only level 1 - no auto-cascading to children on page refresh
        newPath.level1 = firstLevel1.id;

        console.log("Auto-selected level 1 only (no cascading):", newPath);
        return newPath;
      });
    }
  }, [treeData, hasUserMadeSelection, disableAutoSelection]);

  // Add listener for direct path setting (bypasses all other logic)
  useEffect(() => {
    const handleDirectPathSet = (event: CustomEvent) => {
      const newPath = event.detail;
      console.log("[PATH_STATE] Setting path directly:", newPath);
      setSelectedPath(newPath);
    };

    document.addEventListener(
      "set-path-direct",
      handleDirectPathSet as EventListener
    );

    return () => {
      document.removeEventListener(
        "set-path-direct",
        handleDirectPathSet as EventListener
      );
    };
  }, [setSelectedPath]);

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
    userClickedNode,
  };
};
