
import { useState } from "react";
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

export const usePathState = (
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

  // Track the node that user actually clicked for sidebar display
  const [userClickedNode, setUserClickedNode] = useState<{
    level: PathLevel;
    nodeId: string;
  } | null>(null);

  // Store tree data for auto-selection
  const updateTreeData = (data: any) => {
    setTreeData(data);
  };

  const handleAddLevel4 = () => {
    setShowLevel4(true);
  };

  return {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    setHasUserMadeSelection,
    showLevel4,
    setShowLevel4,
    treeData,
    setTreeData,
    userClickedNode,
    setUserClickedNode,
    updateTreeData,
    handleAddLevel4,
  };
};
