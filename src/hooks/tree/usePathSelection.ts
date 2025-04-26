
import { useState } from "react";
import { NodeSuggestion } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";

export const generateChildNode = (parentTitle: string, level: number): NodeSuggestion => {
  const prefix = level === 2 ? "Implementation of" : "Method for";
  return {
    title: `${prefix} ${parentTitle}`,
    description: `Generated child node for ${parentTitle}`
  };
};

export const usePathSelection = (initialPath = {
  level1: "adaptive-optics",
  level2: "medical-applications",
  level3: "retinal-imaging"
}) => {
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [hasUserMadeSelection, setHasUserMadeSelection] = useState(false);
  const [level1Items, setLevel1Items] = useState(initialLevel1Items);
  const [level2Items, setLevel2Items] = useState(initialLevel2Items);
  const [level3Items, setLevel3Items] = useState(initialLevel3Items);

  const handleNodeClick = (level: string, nodeId: string) => {
    setHasUserMadeSelection(true);
    
    setSelectedPath(prev => {
      if (prev[level] === nodeId) {
        if (level === 'level1') {
          return { ...prev, level1: "", level2: "", level3: "" };
        } else if (level === 'level2') {
          return { ...prev, level2: "", level3: "" };
        } else if (level === 'level3') {
          return { ...prev, level3: "" };
        }
      }
      
      if (level === 'level1') {
        return { ...prev, level1: nodeId, level2: "", level3: "" };
      } else if (level === 'level2') {
        return { ...prev, level2: nodeId, level3: "" };
      } else if (level === 'level3') {
        return { ...prev, level3: nodeId };
      }
      return prev;
    });
  };

  const addCustomNode = (level: string, node: NodeSuggestion) => {
    console.log('Adding custom node:', { level, node });
    
    const nodeId = node.title.toLowerCase().replace(/\s+/g, '-');
    const newNode = {
      id: nodeId,
      name: node.title,
      info: "18 papers • 4 implementations", // Updated microcopy
      isCustom: true
    };
    
    if (level === 'level1') {
      setLevel1Items(prev => [...prev, newNode]);
      
      const childNode = generateChildNode(node.title, 2);
      const childId = childNode.title.toLowerCase().replace(/\s+/g, '-');
      setLevel2Items(prev => ({
        ...prev,
        [nodeId]: [{
          id: childId,
          name: childNode.title,
          info: "18 papers • 4 implementations", // Updated for child node
          isCustom: true
        }]
      }));
      
      setSelectedPath(prev => ({ ...prev, level1: nodeId, level2: "", level3: "" }));
    } 
    else if (level === 'level2') {
      const currentLevel1 = selectedPath.level1;
      const currentItems = level2Items[currentLevel1] || [];
      
      setLevel2Items(prev => ({
        ...prev,
        [currentLevel1]: [...currentItems, newNode]
      }));
      
      const childNode = generateChildNode(node.title, 3);
      const childId = childNode.title.toLowerCase().replace(/\s+/g, '-');
      setLevel3Items(prev => ({
        ...prev,
        [nodeId]: [{
          id: childId,
          name: childNode.title,
          info: "18 papers • 4 implementations", // Updated for child node
          isCustom: true
        }]
      }));
      
      setSelectedPath(prev => ({ ...prev, level2: nodeId, level3: "" }));
    } 
    else if (level === 'level3') {
      const currentLevel2 = selectedPath.level2;
      const currentItems = level3Items[currentLevel2] || [];
      
      setLevel3Items(prev => ({
        ...prev,
        [currentLevel2]: [...currentItems, newNode]
      }));
      
      setSelectedPath(prev => ({ ...prev, level3: nodeId }));
    }
    
    toast({
      title: "Node added",
      description: `Added "${node.title}" to Level ${level.charAt(5)}`,
      duration: 2000,
    });
  };

  return {
    selectedPath,
    hasUserMadeSelection,
    handleNodeClick,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items
  };
};
