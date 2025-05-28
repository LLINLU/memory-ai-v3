import { useState } from "react";
import { TreeNode, PathLevel } from "@/types/tree";
import { NodeSuggestion } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { createNodeFromSuggestion, generateChildNode } from "./utils/nodeGenerationUtils";

export interface PathState {
  level1: string;
  level2: string;
  level3: string;
  level4?: string;
}

export const useNodeOperations = (
  initialLevel1Items: TreeNode[], 
  initialLevel2Items: Record<string, TreeNode[]>, 
  initialLevel3Items: Record<string, TreeNode[]>
) => {
  const [level1Items, setLevel1Items] = useState(initialLevel1Items);
  const [level2Items, setLevel2Items] = useState(initialLevel2Items);
  const [level3Items, setLevel3Items] = useState(initialLevel3Items);
  const [level4Items, setLevel4Items] = useState<Record<string, TreeNode[]>>({});
  
  const addCustomNode = (level: PathLevel, node: NodeSuggestion, selectedPath: PathState, setSelectedPath: (updater: (prev: PathState) => PathState) => void) => {
    console.log('Adding custom node:', { level, node });
    
    const newNode = createNodeFromSuggestion(node);
    const nodeId = newNode.id;
    
    if (level === 'level1') {
      newNode.level = 1;
      setLevel1Items(prev => [...prev, newNode]);
      
      const childNode = generateChildNode(node.title, 2);
      const childId = childNode.title.toLowerCase().replace(/\s+/g, '-');
      const childTreeNode = {
        id: childId,
        name: childNode.title,
        info: "18論文 • 4事例",
        isCustom: true,
        description: childNode.description,
        level: 2
      };
      
      setLevel2Items(prev => ({
        ...prev,
        [nodeId]: [childTreeNode]
      }));
      
      setSelectedPath(prev => ({ ...prev, level1: nodeId, level2: "", level3: "", level4: "" }));
    } 
    else if (level === 'level2') {
      newNode.level = 2;
      const currentLevel1 = selectedPath.level1;
      const currentItems = level2Items[currentLevel1] || [];
      
      setLevel2Items(prev => ({
        ...prev,
        [currentLevel1]: [...currentItems, newNode]
      }));
      
      const childNode = generateChildNode(node.title, 3);
      const childId = childNode.title.toLowerCase().replace(/\s+/g, '-');
      const childTreeNode = {
        id: childId,
        name: childNode.title,
        info: "18論文 • 4事例",
        isCustom: true,
        description: childNode.description,
        level: 3
      };
      
      setLevel3Items(prev => ({
        ...prev,
        [nodeId]: [childTreeNode]
      }));
      
      setSelectedPath(prev => ({ ...prev, level2: nodeId, level3: "", level4: "" }));
    } 
    else if (level === 'level3') {
      newNode.level = 3;
      const currentLevel2 = selectedPath.level2;
      const currentItems = level3Items[currentLevel2] || [];
      
      setLevel3Items(prev => ({
        ...prev,
        [currentLevel2]: [...currentItems, newNode]
      }));
      
      setSelectedPath(prev => ({ ...prev, level3: nodeId, level4: "" }));
    }
    else if (level === 'level4') {
      newNode.level = 4;
      const currentLevel3 = selectedPath.level3;
      const currentItems = level4Items[currentLevel3] || [];
      
      setLevel4Items(prev => ({
        ...prev,
        [currentLevel3]: [...currentItems, newNode]
      }));
      
      setSelectedPath(prev => ({ ...prev, level4: nodeId }));
    }
    
    toast({
      title: "ノードが追加されました",
      description: `「${node.title}」をレベル ${level.charAt(5)}に追加しました`,
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
    else if (level === 'level4') {
      setLevel4Items(prev => {
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

    toast({
      title: "Node updated",
      description: `Updated description for "${updatedNode.title}"`,
      duration: 2000,
    });
  };

  const deleteNode = (level: PathLevel, nodeId: string, selectedPath: PathState, setSelectedPath: (updater: (prev: PathState) => PathState) => void) => {
    // Clear the selection if the deleted node is currently selected
    setSelectedPath(prev => {
      if (level === 'level1' && prev.level1 === nodeId) {
        return { ...prev, level1: "", level2: "", level3: "", level4: "" };
      } else if (level === 'level2' && prev.level2 === nodeId) {
        return { ...prev, level2: "", level3: "", level4: "" };
      } else if (level === 'level3' && prev.level3 === nodeId) {
        return { ...prev, level3: "", level4: "" };
      } else if (level === 'level4' && prev.level4 === nodeId) {
        return { ...prev, level4: "" };
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
      
      // Also remove its children from level4Items
      setLevel4Items(prev => {
        const newLevel4Items = { ...prev };
        delete newLevel4Items[nodeId];
        return newLevel4Items;
      });
    }
    else if (level === 'level4') {
      setLevel4Items(prev => {
        const updatedItems = { ...prev };
        Object.keys(updatedItems).forEach(key => {
          updatedItems[key] = updatedItems[key].filter(item => item.id !== nodeId);
        });
        return updatedItems;
      });
    }
  };

  return {
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    addCustomNode,
    editNode,
    deleteNode
  };
};
