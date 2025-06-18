
import { PathLevel } from "@/types/tree";
import { PathState } from "../state/usePathState";
import { findCompletePath, clearPathFromLevel, autoSelectChildren } from "../utils/pathUtils";

export const useNodeClickHandler = (
  disableAutoSelection: boolean,
  treeData: any,
  initialPath: PathState,
  setSelectedPath: (updater: (prev: PathState) => PathState) => void,
  setHasUserMadeSelection: (value: boolean) => void,
  setUserClickedNode: (node: { level: PathLevel; nodeId: string } | null) => void
) => {
  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    console.log("Node clicked:", { level, nodeId, disableAutoSelection });
    setHasUserMadeSelection(true);

    // Track the user's actual click for sidebar display
    setUserClickedNode({ level, nodeId });

    setSelectedPath((prev) => {
      if (prev[level] === nodeId) {
        // Clear the selected level and all subsequent levels
        return clearPathFromLevel(prev, level);
      }

      // MINDMAP MODE: Build complete path by traversing up the tree
      if (disableAutoSelection) {
        console.log("Mindmap mode: Building complete path for", level, nodeId);
        return findCompletePath(level, nodeId, treeData, initialPath);
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
      const clearedPath = clearPathFromLevel(newPath, level);

      // Set the selected level
      clearedPath[level] = nodeId;

      // Auto-select children
      return autoSelectChildren(clearedPath, level, nodeId, treeData);
    });
  };

  return { handleNodeClick };
};
