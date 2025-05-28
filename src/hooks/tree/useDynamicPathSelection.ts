
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NodeSuggestion } from "@/types/chat";
import { PathLevel } from "@/types/tree";
import { useNodeOperations } from "./useNodeOperations";
import { usePathSelectionState } from "./usePathSelectionState";
import { generateDynamicTree } from "@/utils/dynamicTreeGenerator";

export const useDynamicPathSelection = (initialPath = {
  level1: "",
  level2: "",
  level3: "",
  level4: ""
}) => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string; 
    searchMode?: string;
    researchAnswers?: any;
  } | null;

  // Generate dynamic tree based on context
  const dynamicTree = generateDynamicTree({
    query: locationState?.query || "",
    scenario: locationState?.scenario || "",
    searchMode: locationState?.searchMode || "quick"
  });

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
    level4Items = {},
    addCustomNode: addNode,
    editNode,
    deleteNode: removeNode,
    setLevel1Items,
    setLevel2Items,
    setLevel3Items
  } = useNodeOperations(
    dynamicTree.level1Items, 
    dynamicTree.level2Items, 
    dynamicTree.level3Items
  );

  // Update tree data when location state changes
  useEffect(() => {
    if (locationState) {
      const newTree = generateDynamicTree({
        query: locationState.query || "",
        scenario: locationState.scenario || "",
        searchMode: locationState.searchMode || "quick"
      });
      
      setLevel1Items(newTree.level1Items);
      setLevel2Items(newTree.level2Items);
      setLevel3Items(newTree.level3Items);
      
      // Reset selection when tree changes
      setSelectedPath({
        level1: "",
        level2: "",
        level3: "",
        level4: ""
      });
    }
  }, [locationState?.query, locationState?.scenario, locationState?.searchMode]);

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
