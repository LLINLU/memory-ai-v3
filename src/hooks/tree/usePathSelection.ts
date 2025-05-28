
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";
import { NodeSuggestion } from "@/types/chat";
import { PathLevel } from "@/types/tree";
import { useNodeOperations } from "./useNodeOperations";
import { usePathSelectionState, PathState } from "./usePathSelectionState";
import { getMockTedData } from "./useMockTedData";
import { useLocation } from "react-router-dom";

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
    level4Items?: Record<string, any[]>;
  }
) => {
  const location = useLocation();
  const locationState = location.state as { query?: string } | null;

  const {
    selectedPath,
    setSelectedPath,
    hasUserMadeSelection,
    handleNodeClick: handlePathNodeClick,
    showLevel4,
    setShowLevel4,
    handleAddLevel4
  } = usePathSelectionState(initialPath);

  // Determine data source: use provided treeData, or generate from mock data, or fall back to default
  let level1Data, level2Data, level3Data, level4Data;

  if (treeData?.level1Items) {
    // Use provided tree data (from TED results)
    level1Data = treeData.level1Items;
    level2Data = treeData.level2Items || {};
    level3Data = treeData.level3Items || {};
    level4Data = treeData.level4Items || {};
    console.log('Using provided TED tree data');
  } else if (locationState?.query) {
    // Generate mock data based on query
    const mockDataResult = getMockTedData(locationState.query);
    level1Data = mockDataResult.treeData?.level1Items || initialLevel1Items;
    level2Data = mockDataResult.treeData?.level2Items || initialLevel2Items;
    level3Data = mockDataResult.treeData?.level3Items || initialLevel3Items;
    level4Data = mockDataResult.treeData?.level4Items || {};
    console.log('Using mock data for query:', locationState.query);
  } else {
    // Fall back to default data
    level1Data = initialLevel1Items;
    level2Data = initialLevel2Items;
    level3Data = initialLevel3Items;
    level4Data = {};
    console.log('Using default static data');
  }

  console.log('usePathSelection - Final data sources:', {
    level1Count: level1Data.length,
    level2Count: Object.keys(level2Data).length,
    level3Count: Object.keys(level3Data).length,
    level4Count: Object.keys(level4Data).length
  });

  const {
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode
  } = useNodeOperations(level1Data, level2Data, level3Data, level4Data);

  // Set initial path to first available item if TED data is provided and current path doesn't exist
  if (level1Data.length > 0) {
    const currentLevel1Exists = level1Data.find(item => item.id === selectedPath.level1);
    if (!currentLevel1Exists) {
      console.log('Setting initial path to first item:', level1Data[0].id);
      setSelectedPath(prev => ({
        ...prev,
        level1: level1Data[0].id,
        level2: "",
        level3: "",
        level4: ""
      }));
    }
  }

  // Wrapper functions to maintain the same API
  const handleNodeClick = (level: PathLevel, nodeId: string) => {
    handlePathNodeClick(level, nodeId);
  };

  // Create a wrapper function that matches the expected signature
  const setSelectedPathWrapper = (updater: (prev: PathState) => PathState) => {
    setSelectedPath(updater);
  };

  const addCustomNode = (level: PathLevel, node: NodeSuggestion) => {
    addNode(level, node, selectedPath, setSelectedPathWrapper);
  };

  const deleteNode = (level: PathLevel, nodeId: string) => {
    removeNode(level, nodeId, selectedPath, setSelectedPathWrapper);
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
