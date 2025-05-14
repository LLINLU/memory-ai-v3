
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";
import { NodeSuggestion } from "@/types/chat";
import { useNodeOperations } from "./useNodeOperations";
import { usePathSelectionState } from "./usePathSelectionState";

export const usePathSelection = (initialPath = {
  level1: "astronomy",
  level2: "turbulence-compensation",
  level3: "laser-guide-star",
  level4: ""
}) => {
  const {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    handleNodeClick: handlePathNodeClick,
    showLevel4,
    setShowLevel4,
    handleAddLevel4
  } = usePathSelectionState(initialPath);

  const {
    level1Items,
    level2Items,
    level3Items,
    level4Items = {},  // Default empty object for level4
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode
  } = useNodeOperations(initialLevel1Items, initialLevel2Items, initialLevel3Items);

  // Wrapper functions to maintain the same API
  const handleNodeClick = (level: string, nodeId: string) => {
    handlePathNodeClick(level, nodeId);
  };

  const addCustomNode = (level: string, node: NodeSuggestion) => {
    addNode(level, node, selectedPath, setSelectedPath);
  };

  const deleteNode = (level: string, nodeId: string) => {
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
