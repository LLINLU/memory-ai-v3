
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";
import { NodeSuggestion } from "@/types/chat";
import { PathLevel } from "@/types/tree";
import { useNodeOperations } from "./useNodeOperations";
import { usePathSelectionState } from "./usePathSelectionState";

export const usePathSelection = (
  initialPath = {
    level1: "astronomy",
    level2: "turbulence-compensation", 
    level3: "laser-guide-star",
    level4: ""
  },
  treeData?: {
    level1Items?: any[];
    level2Items?: Record<string, any[]>;
    level3Items?: Record<string, any[]>;
  }
) => {
  const {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    handleNodeClick: handlePathNodeClick,
    showLevel4,
    setShowLevel4,
    handleAddLevel4
  } = usePathSelectionState(initialPath);

  // Use TED-generated data if available, otherwise fall back to default data
  const level1Data = treeData?.level1Items || initialLevel1Items;
  const level2Data = treeData?.level2Items || initialLevel2Items;
  const level3Data = treeData?.level3Items || initialLevel3Items;

  const {
    level1Items,
    level2Items,
    level3Items,
    level4Items = {},
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode
  } = useNodeOperations(level1Data, level2Data, level3Data);

  // Wrapper functions to maintain the same API
  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    handlePathNodeClick(level, nodeId);
  };

  const addCustomNode = (level: PathLevel, node: NodeSuggestion) => {
    addNode(level, node, selectedPath, setSelectedPath);
  };

  const deleteNode = (level: PathLevel, nodeId: string) => {
    removeNode(level, nodeId, selectedPath, setSelectedPath);
  };

  return {
    selectedPath,
    hasUserMadeSelection,
    handleNodeClick,
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    showLevel4,
    handleAddLevel4
  };
};
