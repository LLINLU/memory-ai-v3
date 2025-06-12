
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
const MIN_SPACING = 20; // Minimum spacing to prevent overlap

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
  
  // Track positions for each level to avoid overlapping
  const levelYPositions: Record<number, number> = {};

  // Helper function to get next Y position for a level
  const getNextYPosition = (level: number): number => {
    if (!levelYPositions[level]) {
      levelYPositions[level] = 50; // Start with some padding
    } else {
      levelYPositions[level] += NODE_HEIGHT + NODE_SPACING;
    }
    return levelYPositions[level];
  };

  // Helper function to create a node
  const createNode = (
    item: TreeNode,
    level: number,
    levelName: string,
    parentId?: string
  ): MindMapNode => {
    const x = (level - 1) * LEVEL_SPACING + 50; // Add left padding
    const y = getNextYPosition(level);
    
    return {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level,
      levelName,
      x,
      y,
      parentId,
      isSelected: selectedPath[`level${level}`] === item.id,
      isCustom: item.isCustom || false,
    };
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

  // FIRST PASS: Create all nodes with level-based positioning
  // Process Level 1 nodes - show ALL level 1 items
  level1Items.forEach((item) => {
    const node = createNode(item, 1, levelNames.level1 || "Level 1");
    nodes.push(node);
  });

  // Process Level 2 nodes - show ALL level 2 items
  Object.entries(level2Items).forEach(([parentId, items]) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (parentNode && items) {
      items.forEach((item) => {
        const node = createNode(item, 2, levelNames.level2 || "Level 2", parentId);
        nodes.push(node);
        connections.push(createConnection(parentNode, node));
      });
    }
  });

  // Process Level 3 nodes - show ALL level 3 items
  Object.entries(level3Items).forEach(([parentId, items]) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (parentNode && items) {
      items.forEach((item) => {
        const node = createNode(item, 3, levelNames.level3 || "Level 3", parentId);
        nodes.push(node);
        connections.push(createConnection(parentNode, node));
      });
    }
  });

  // Process Level 4-10 nodes - show ALL items for each level
  const levelData = [
    { items: level4Items, level: 4, name: levelNames.level4 || "Level 4" },
    { items: level5Items, level: 5, name: levelNames.level5 || "Level 5" },
    { items: level6Items, level: 6, name: levelNames.level6 || "Level 6" },
    { items: level7Items, level: 7, name: levelNames.level7 || "Level 7" },
    { items: level8Items, level: 8, name: levelNames.level8 || "Level 8" },
    { items: level9Items, level: 9, name: levelNames.level9 || "Level 9" },
    { items: level10Items, level: 10, name: levelNames.level10 || "Level 10" },
  ];

  levelData.forEach(({ items, level, name }) => {
    Object.entries(items).forEach(([parentId, nodeItems]) => {
      const parentNode = nodes.find(n => n.id === parentId);
      if (parentNode && nodeItems) {
        nodeItems.forEach((item) => {
          const node = createNode(item, level, name, parentId);
          nodes.push(node);
          connections.push(createConnection(parentNode, node));
        });
      }
    });
  });

  // SECOND PASS: Center parent nodes between their children
  const centerParentNodes = () => {
    // Group children by parent
    const childrenByParent: Record<string, MindMapNode[]> = {};
    nodes.forEach(node => {
      if (node.parentId) {
        if (!childrenByParent[node.parentId]) {
          childrenByParent[node.parentId] = [];
        }
        childrenByParent[node.parentId].push(node);
      }
    });

    // Adjust parent positions to center them between children
    Object.entries(childrenByParent).forEach(([parentId, children]) => {
      if (children.length < 2) return; // No centering needed for single child or no children

      const parentNode = nodes.find(n => n.id === parentId);
      if (!parentNode) return;

      // Find the Y positions of children
      const childrenYPositions = children.map(child => child.y).sort((a, b) => a - b);
      const topChildY = childrenYPositions[0];
      const bottomChildY = childrenYPositions[childrenYPositions.length - 1];
      
      // Calculate the center position
      const centerY = topChildY + (bottomChildY - topChildY) / 2;
      
      // Check if centering would cause overlap with other nodes at the same level
      const sameLevel = nodes.filter(n => n.level === parentNode.level && n.id !== parentNode.id);
      const wouldOverlap = sameLevel.some(node => {
        const distance = Math.abs(node.y - centerY);
        return distance < (NODE_HEIGHT + MIN_SPACING);
      });

      // Only center if it doesn't cause overlap
      if (!wouldOverlap) {
        parentNode.y = centerY;
        console.log(`Centered parent ${parentId} between children at Y: ${centerY}`);
      } else {
        console.log(`Skipped centering parent ${parentId} to avoid overlap`);
      }
    });
  };

  // Apply parent centering
  centerParentNodes();

  // Update connections after repositioning
  connections.forEach(connection => {
    const sourceNode = nodes.find(n => n.id === connection.sourceId);
    const targetNode = nodes.find(n => n.id === connection.targetId);
    if (sourceNode && targetNode) {
      connection.sourceX = sourceNode.x + NODE_WIDTH;
      connection.sourceY = sourceNode.y + NODE_HEIGHT / 2;
      connection.targetX = targetNode.x;
      connection.targetY = targetNode.y + NODE_HEIGHT / 2;
    }
  });

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
