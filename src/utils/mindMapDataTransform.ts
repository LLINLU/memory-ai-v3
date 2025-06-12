
import { TreeNode } from "@/types/tree";
import * as d3 from 'd3';

export interface MindMapNode {
  id: string;
  name: string;
  description: string;
  level: number;
  levelName: string;
  x: number;
  y: number;
  parentId?: string;
  isSelected?: boolean;
  isCustom?: boolean;
}

export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

// Helper function to build hierarchical data structure from flat level data
const buildHierarchy = (
  level1Items: TreeNode[],
  level2Items: Record<string, TreeNode[]>,
  level3Items: Record<string, TreeNode[]>,
  level4Items: Record<string, TreeNode[]>,
  level5Items: Record<string, TreeNode[]>,
  level6Items: Record<string, TreeNode[]>,
  level7Items: Record<string, TreeNode[]>,
  level8Items: Record<string, TreeNode[]>,
  level9Items: Record<string, TreeNode[]>,
  level10Items: Record<string, TreeNode[]>,
  levelNames: Record<string, string>,
  selectedPath: any
) => {
  const hierarchy: any = {
    name: "Root",
    level: 0,
    children: []
  };

  // Add level 1 items
  level1Items.forEach((item) => {
    const level1Node = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level: 1,
      levelName: levelNames.level1 || "Level 1",
      isSelected: selectedPath.level1 === item.id,
      isCustom: item.isCustom || false,
      children: []
    };

    // Add level 2 items for this level 1 item
    const level2Children = level2Items[item.id] || [];
    level2Children.forEach((level2Item) => {
      const level2Node = {
        id: level2Item.id,
        name: level2Item.name,
        description: level2Item.description || "",
        level: 2,
        levelName: levelNames.level2 || "Level 2",
        isSelected: selectedPath.level2 === level2Item.id,
        isCustom: level2Item.isCustom || false,
        children: []
      };

      // Add level 3 items for this level 2 item
      const level3Children = level3Items[level2Item.id] || [];
      level3Children.forEach((level3Item) => {
        const level3Node = {
          id: level3Item.id,
          name: level3Item.name,
          description: level3Item.description || "",
          level: 3,
          levelName: levelNames.level3 || "Level 3",
          isSelected: selectedPath.level3 === level3Item.id,
          isCustom: level3Item.isCustom || false,
          children: []
        };

        // Add level 4+ items recursively
        addChildrenRecursively(level3Node, level3Item.id, 4, [
          level4Items, level5Items, level6Items, level7Items, 
          level8Items, level9Items, level10Items
        ], levelNames, selectedPath);

        level2Node.children.push(level3Node);
      });

      level1Node.children.push(level2Node);
    });

    hierarchy.children.push(level1Node);
  });

  return hierarchy;
};

// Helper function to recursively add children for levels 4-10
const addChildrenRecursively = (
  parentNode: any,
  parentId: string,
  currentLevel: number,
  levelItemsArray: Record<string, TreeNode[]>[],
  levelNames: Record<string, string>,
  selectedPath: any
) => {
  if (currentLevel > 10 || currentLevel - 4 >= levelItemsArray.length) return;

  const currentLevelItems = levelItemsArray[currentLevel - 4][parentId] || [];
  currentLevelItems.forEach((item) => {
    const childNode = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level: currentLevel,
      levelName: levelNames[`level${currentLevel}`] || `Level ${currentLevel}`,
      isSelected: selectedPath[`level${currentLevel}`] === item.id,
      isCustom: item.isCustom || false,
      children: []
    };

    // Recursively add children for the next level
    addChildrenRecursively(childNode, item.id, currentLevel + 1, levelItemsArray, levelNames, selectedPath);
    parentNode.children.push(childNode);
  });
};

// Helper function to create D3 nodes from hierarchical data
const createD3Nodes = (hierarchicalData: any): MindMapNode[] => {
  if (!hierarchicalData.children || hierarchicalData.children.length === 0) {
    return [];
  }

  const root = d3.hierarchy(hierarchicalData);
  
  const treeLayout = d3.tree()
    .nodeSize([120, 300])
    .separation((a, b) => a.parent === b.parent ? 1.5 : 2.5);
  
  treeLayout(root);
  
  // Filter out the artificial root node and return only actual nodes
  return root.descendants()
    .filter(node => node.depth > 0) // Skip the artificial root
    .map(node => ({
      id: node.data.id,
      name: node.data.name,
      description: node.data.description,
      level: node.data.level,
      levelName: node.data.levelName,
      x: node.y + 50, // Add margin
      y: node.x + 50, // Add margin
      parentId: node.parent && node.parent.depth > 0 ? node.parent.data.id : undefined,
      isSelected: node.data.isSelected,
      isCustom: node.data.isCustom,
    }));
};

// Helper function to create connections from D3 hierarchy
const createD3Connections = (hierarchicalData: any): MindMapConnection[] => {
  if (!hierarchicalData.children || hierarchicalData.children.length === 0) {
    return [];
  }

  const root = d3.hierarchy(hierarchicalData);
  
  const treeLayout = d3.tree()
    .nodeSize([120, 300])
    .separation((a, b) => a.parent === b.parent ? 1.5 : 2.5);
  
  treeLayout(root);

  const connections: MindMapConnection[] = [];
  
  root.links()
    .filter(link => link.source.depth > 0) // Skip connections from artificial root
    .forEach((link) => {
      const sourceX = link.source.y + 50 + NODE_WIDTH;
      const sourceY = link.source.x + 50 + NODE_HEIGHT / 2;
      const targetX = link.target.y + 50;
      const targetY = link.target.x + 50 + NODE_HEIGHT / 2;

      connections.push({
        id: `${link.source.data.id}-${link.target.data.id}`,
        sourceId: link.source.data.id,
        targetId: link.target.data.id,
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
    });

  return connections;
};

export const transformToMindMapData = (
  level1Items: TreeNode[],
  level2Items: Record<string, TreeNode[]>,
  level3Items: Record<string, TreeNode[]>,
  level4Items: Record<string, TreeNode[]>,
  level5Items: Record<string, TreeNode[]>,
  level6Items: Record<string, TreeNode[]>,
  level7Items: Record<string, TreeNode[]>,
  level8Items: Record<string, TreeNode[]>,
  level9Items: Record<string, TreeNode[]>,
  level10Items: Record<string, TreeNode[]>,
  levelNames: Record<string, string>,
  selectedPath: any
) => {
  // Build hierarchical data structure
  const hierarchicalData = buildHierarchy(
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
    levelNames,
    selectedPath
  );

  // Create nodes and connections using D3 tree layout
  const nodes = createD3Nodes(hierarchicalData);
  const connections = createD3Connections(hierarchicalData);

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections using D3 tree layout`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
