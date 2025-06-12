
import { TreeNode } from "@/types/tree";

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
const LEVEL_SPACING = 300;
const NODE_SPACING = 100;
const PARENT_GROUP_SPACING = 200; // Spacing between different parent-child groups

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
  const nodes: MindMapNode[] = [];
  const connections: MindMapConnection[] = [];
  
  // Track Y positions for parent groups at each level
  let currentLevelYOffset: Record<number, number> = {};

  // Helper function to get next Y position for a parent group
  const getNextParentGroupY = (level: number): number => {
    if (!currentLevelYOffset[level]) {
      currentLevelYOffset[level] = 50; // Start with padding
    } else {
      currentLevelYOffset[level] += PARENT_GROUP_SPACING;
    }
    return currentLevelYOffset[level];
  };

  // Helper function to create a connection
  const createConnection = (sourceNode: MindMapNode, targetNode: MindMapNode): MindMapConnection => {
    return {
      id: `${sourceNode.id}-${targetNode.id}`,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      sourceX: sourceNode.x + NODE_WIDTH,
      sourceY: sourceNode.y + NODE_HEIGHT / 2,
      targetX: targetNode.x,
      targetY: targetNode.y + NODE_HEIGHT / 2,
    };
  };

  // FIRST PASS: Create Level 1 nodes (no parents)
  let level1YPosition = 50;
  level1Items.forEach((item) => {
    const node: MindMapNode = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level: 1,
      levelName: levelNames.level1 || "Level 1",
      x: 50,
      y: level1YPosition,
      isSelected: selectedPath.level1 === item.id,
      isCustom: item.isCustom || false,
    };
    nodes.push(node);
    level1YPosition += NODE_HEIGHT + NODE_SPACING;
  });

  // Helper function to process children with parent-relative positioning
  const processChildrenLevel = (
    childrenData: Record<string, TreeNode[]>,
    level: number,
    levelName: string
  ) => {
    Object.entries(childrenData).forEach(([parentId, children]) => {
      const parentNode = nodes.find(n => n.id === parentId);
      if (!parentNode || !children || children.length === 0) return;

      const x = (level - 1) * LEVEL_SPACING + 50;

      if (children.length === 1) {
        // Single child: place at same level as parent
        const child: MindMapNode = {
          id: children[0].id,
          name: children[0].name,
          description: children[0].description || "",
          level,
          levelName,
          x,
          y: parentNode.y,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[0].id,
          isCustom: children[0].isCustom || false,
        };
        nodes.push(child);
        connections.push(createConnection(parentNode, child));

      } else if (children.length === 2) {
        // Two children: one above, one below parent
        const spacing = NODE_HEIGHT + NODE_SPACING;
        
        // First child above parent
        const firstChild: MindMapNode = {
          id: children[0].id,
          name: children[0].name,
          description: children[0].description || "",
          level,
          levelName,
          x,
          y: parentNode.y - spacing,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[0].id,
          isCustom: children[0].isCustom || false,
        };
        
        // Second child below parent
        const secondChild: MindMapNode = {
          id: children[1].id,
          name: children[1].name,
          description: children[1].description || "",
          level,
          levelName,
          x,
          y: parentNode.y + spacing,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[1].id,
          isCustom: children[1].isCustom || false,
        };

        nodes.push(firstChild, secondChild);
        connections.push(createConnection(parentNode, firstChild));
        connections.push(createConnection(parentNode, secondChild));

      } else {
        // Multiple children: distribute around parent
        const spacing = NODE_HEIGHT + NODE_SPACING;
        const totalHeight = (children.length - 1) * spacing;
        const startY = parentNode.y - totalHeight / 2;

        children.forEach((childItem, index) => {
          const child: MindMapNode = {
            id: childItem.id,
            name: childItem.name,
            description: childItem.description || "",
            level,
            levelName,
            x,
            y: startY + (index * spacing),
            parentId,
            isSelected: selectedPath[`level${level}`] === childItem.id,
            isCustom: childItem.isCustom || false,
          };
          nodes.push(child);
          connections.push(createConnection(parentNode, child));
        });
      }
    });
  };

  // Process all child levels
  processChildrenLevel(level2Items, 2, levelNames.level2 || "Level 2");
  processChildrenLevel(level3Items, 3, levelNames.level3 || "Level 3");
  processChildrenLevel(level4Items, 4, levelNames.level4 || "Level 4");
  processChildrenLevel(level5Items, 5, levelNames.level5 || "Level 5");
  processChildrenLevel(level6Items, 6, levelNames.level6 || "Level 6");
  processChildrenLevel(level7Items, 7, levelNames.level7 || "Level 7");
  processChildrenLevel(level8Items, 8, levelNames.level8 || "Level 8");
  processChildrenLevel(level9Items, 9, levelNames.level9 || "Level 9");
  processChildrenLevel(level10Items, 10, levelNames.level10 || "Level 10");

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
