
import React from "react";
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

  // Determine data source: use provided treeData, or generate from mock data, or fall back to mock default
  let level1Data, level2Data, level3Data, level4Data;

  if (treeData?.level1Items) {
    // Use provided tree data (from TED results)
    level1Data = treeData.level1Items;
    level2Data = treeData.level2Items || {};
    level3Data = treeData.level3Items || {};
    level4Data = treeData.level4Items || {};
    console.log('Using provided TED tree data');
  } else {
    // Always use mock data for technology tree page - either from query or default to forest management
    const query = locationState?.query || "森林管理"; // Default to forest management
    const mockDataResult = getMockTedData(query);
    level1Data = mockDataResult.treeData?.level1Items || [];
    level2Data = mockDataResult.treeData?.level2Items || {};
    level3Data = mockDataResult.treeData?.level3Items || {};
    level4Data = mockDataResult.treeData?.level4Items || {};
    console.log('Using mock data for query:', query);
    console.log('Mock data loaded:', {
      level1Count: level1Data.length,
      level2Count: Object.keys(level2Data).length,
      level3Count: Object.keys(level3Data).length,
      level4Count: Object.keys(level4Data).length
    });
  }

  const {
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode
  } = useNodeOperations(level1Data, level2Data, level3Data, level4Data);

  // Set initial path to first available item when data loads
  React.useEffect(() => {
    if (level1Data.length > 0) {
      const firstLevel1 = level1Data[0];
      const firstLevel2 = level2Data[firstLevel1.id]?.[0];
      const firstLevel3 = firstLevel2 ? level3Data[firstLevel2.id]?.[0] : null;
      const firstLevel4 = firstLevel3 ? level4Data[firstLevel3.id]?.[0] : null;

      console.log('Setting initial path:', {
        level1: firstLevel1.id,
        level2: firstLevel2?.id || "",
        level3: firstLevel3?.id || "",
        level4: firstLevel4?.id || ""
      });

      setSelectedPath({
        level1: firstLevel1.id,
        level2: firstLevel2?.id || "",
        level3: firstLevel3?.id || "",
        level4: firstLevel4?.id || ""
      });
    }
  }, [level1Data, level2Data, level3Data, level4Data, setSelectedPath]);

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
