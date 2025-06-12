import { NodeSuggestion } from "@/types/chat";
import { PathLevel } from "@/types/tree";
import { useNodeOperations } from "./useNodeOperations";
import { usePathSelectionState } from "./usePathSelectionState";
import { useEffect } from "react";

export const usePathSelection = (
  initialPath = {
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
  treeData?: {
    level1Items?: any[];
    level2Items?: Record<string, any[]>;
    level3Items?: Record<string, any[]>;
    level4Items?: Record<string, any[]>;
    level5Items?: Record<string, any[]>;
    level6Items?: Record<string, any[]>;
    level7Items?: Record<string, any[]>;
    level8Items?: Record<string, any[]>;
    level9Items?: Record<string, any[]>;
    level10Items?: Record<string, any[]>;
  }
) => {
  const {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    handleNodeClick: handlePathNodeClick,
    showLevel4,
    setShowLevel4,
    handleAddLevel4,
    updateTreeData,
  } = usePathSelectionState(initialPath);

  // Update tree data for auto-selection
  useEffect(() => {
    if (treeData) {
      updateTreeData(treeData);
    }
  }, [treeData, updateTreeData]);
  // Use only TED-generated data if available, otherwise use empty arrays
  const level1Data = treeData?.level1Items || [];
  const level2Data = treeData?.level2Items || {};
  const level3Data = treeData?.level3Items || {};
  const level4Data = treeData?.level4Items || {};
  const level5Data = treeData?.level5Items || {};
  const level6Data = treeData?.level6Items || {};
  const level7Data = treeData?.level7Items || {};
  const level8Data = treeData?.level8Items || {};
  const level9Data = treeData?.level9Items || {};
  const level10Data = treeData?.level10Items || {};

  const {
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode,
  } = useNodeOperations(
    level1Data,
    level2Data,
    level3Data,
    level4Data,
    level5Data,
    level6Data,
    level7Data,
    level8Data,
    level9Data,
    level10Data
  ); // Update path when tree data changes to ensure valid selections
  useEffect(() => {
    if (treeData?.level1Items && treeData.level1Items.length > 0) {
      const currentLevel1Exists = treeData.level1Items.find(
        (item) => item.id === selectedPath.level1
      );
      if (!currentLevel1Exists) {
        setSelectedPath((prev) => ({
          ...prev,
          level1: treeData.level1Items[0].id,
          level2: "",
          level3: "",
          level4: "",
          level5: "",
          level6: "",
          level7: "",
          level8: "",
          level9: "",
          level10: "",
        }));
      }
    }
  }, [treeData, setSelectedPath]);

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
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    showLevel4,
    handleAddLevel4,
  };
};
