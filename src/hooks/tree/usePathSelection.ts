
import { useState } from "react";
import { NodeSuggestion } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { level1Items as initialLevel1Items, level2Items as initialLevel2Items, level3Items as initialLevel3Items } from "@/data/technologyTreeData";

export const generateChildNode = (parentTitle: string, level: number): NodeSuggestion => {
  const prefixes = {
    2: [
      "Advanced", 
      "Novel",
      "Improved",
      "Enhanced",
      "Modern"
    ],
    3: [
      "Algorithm for",
      "Technique for",
      "Method for",
      "Approach to",
      "System for"
    ]
  };

  const randomPrefix = (level === 2 ? prefixes[2] : prefixes[3])[Math.floor(Math.random() * 5)];
  return {
    title: `${randomPrefix} ${parentTitle}`,
    description: `Generated child node for ${parentTitle}`
  };
};

export const usePathSelection = (initialPath = {
  level1: "astronomy",
  level2: "turbulence-compensation",
  level3: "laser-guide-star"
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
      info: "18 papers • 4 implementations",
      isCustom: true,
      description: node.description || `Custom node for ${node.title}`
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
          info: "18 papers • 4 implementations",
          isCustom: true,
          description: childNode.description
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
          info: "18 papers • 4 implementations",
          isCustom: true,
          description: childNode.description
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

  const editNode = (level: string, nodeId: string, updatedNode: { title: string; description: string }) => {
    if (level === 'level1') {
      setLevel1Items(prev => prev.map(item => 
        item.id === nodeId 
          ? { 
              ...item, 
              name: updatedNode.title, 
              description: updatedNode.description 
            } 
          : item
      ));
    } 
    else if (level === 'level2') {
      setLevel2Items(prev => {
        const updatedItems = { ...prev };
        Object.keys(updatedItems).forEach(key => {
          updatedItems[key] = updatedItems[key].map(item => 
            item.id === nodeId 
              ? { 
                  ...item, 
                  name: updatedNode.title, 
                  description: updatedNode.description 
                } 
              : item
          );
        });
        return updatedItems;
      });
    } 
    else if (level === 'level3') {
      setLevel3Items(prev => {
        const updatedItems = { ...prev };
        Object.keys(updatedItems).forEach(key => {
          updatedItems[key] = updatedItems[key].map(item => 
            item.id === nodeId 
              ? { 
                  ...item, 
                  name: updatedNode.title, 
                  description: updatedNode.description 
                } 
              : item
          );
        });
        return updatedItems;
      });
    }

    // Add a toast to confirm the edit was saved
    toast({
      title: "Node updated",
      description: `Updated description for "${updatedNode.title}"`,
      duration: 2000,
    });
  };

  const deleteNode = (level: string, nodeId: string) => {
    // Clear the selection if the deleted node is currently selected
    setSelectedPath(prev => {
      if (level === 'level1' && prev.level1 === nodeId) {
        return { ...prev, level1: "", level2: "", level3: "" };
      } else if (level === 'level2' && prev.level2 === nodeId) {
        return { ...prev, level2: "", level3: "" };
      } else if (level === 'level3' && prev.level3 === nodeId) {
        return { ...prev, level3: "" };
      }
      return prev;
    });

    // Remove the node from state
    if (level === 'level1') {
      setLevel1Items(prev => prev.filter(item => item.id !== nodeId));
      
      // Also remove its children from level2Items
      setLevel2Items(prev => {
        const newLevel2Items = { ...prev };
        delete newLevel2Items[nodeId];
        return newLevel2Items;
      });
    } 
    else if (level === 'level2') {
      setLevel2Items(prev => {
        const updatedItems = { ...prev };
        Object.keys(updatedItems).forEach(key => {
          updatedItems[key] = updatedItems[key].filter(item => item.id !== nodeId);
        });
        return updatedItems;
      });
      
      // Also remove its children from level3Items
      setLevel3Items(prev => {
        const newLevel3Items = { ...prev };
        delete newLevel3Items[nodeId];
        return newLevel3Items;
      });
    } 
    else if (level === 'level3') {
      setLevel3Items(prev => {
        const updatedItems = { ...prev };
        Object.keys(updatedItems).forEach(key => {
          updatedItems[key] = updatedItems[key].filter(item => item.id !== nodeId);
        });
        return updatedItems;
      });
    }
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
    level3Items
  };
};
