
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
const GROUP_SPACING = 150; // Additional spacing between parent-child groups

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
  
  // Track Y positions for level 1 to avoid overlapping
  let level1YPosition = 50;

  // Helper function to create a node
  const createNode = (
    item: TreeNode,
    level: number,
    levelName: string,
    x: number,
    y: number,
    parentId?: string
  ): MindMapNode => {
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

  // Process Level 1 nodes with sequential positioning
  level1Items.forEach((item) => {
    const x = 50; // Left padding
    const y = level1YPosition;
    const node = createNode(item, 1, levelNames.level1 || "Level 1", x, y);
    nodes.push(node);
    level1YPosition += NODE_HEIGHT + GROUP_SPACING; // Space for this node and its children
  });

  // Function to position children around a parent
  const positionChildrenAroundParent = (
    parentNode: MindMapNode,
    children: TreeNode[],
    level: number,
    levelName: string
  ) => {
    if (children.length === 0) return;

    const parentCenterY = parentNode.y + NODE_HEIGHT / 2;
    const x = parentNode.x + LEVEL_SPACING;

    children.forEach((child, index) => {
      let y: number;
      
      if (index === 0) {
        // First child above parent
        y = parentCenterY - NODE_HEIGHT / 2 - NODE_SPACING;
      } else {
        // Subsequent children below parent
        const belowOffset = index * (NODE_HEIGHT + NODE_SPACING);
        y = parentCenterY + NODE_HEIGHT / 2 + belowOffset;
      }

      const childNode = createNode(child, level, levelName, x, y, parentNode.id);
      nodes.push(childNode);
    });
  };

  // Function to center parent between its children
  const centerParentBetweenChildren = (parentNode: MindMapNode) => {
    const children = nodes.filter(n => n.parentId === parentNode.id);
    if (children.length === 0) return;

    const minChildY = Math.min(...children.map(c => c.y));
    const maxChildY = Math.max(...children.map(c => c.y + NODE_HEIGHT));
    const centerY = (minChildY + maxChildY) / 2 - NODE_HEIGHT / 2;
    
    parentNode.y = centerY;
  };

  // Process all levels using parent-relative positioning
  const levelData = [
    { items: level2Items, level: 2, name: levelNames.level2 || "Level 2" },
    { items: level3Items, level: 3, name: levelNames.level3 || "Level 3" },
    { items: level4Items, level: 4, name: levelNames.level4 || "Level 4" },
    { items: level5Items, level: 5, name: levelNames.level5 || "Level 5" },
    { items: level6Items, level: 6, name: levelNames.level6 || "Level 6" },
    { items: level7Items, level: 7, name: levelNames.level7 || "Level 7" },
    { items: level8Items, level: 8, name: levelNames.level8 || "Level 8" },
    { items: level9Items, level: 9, name: levelNames.level9 || "Level 9" },
    { items: level10Items, level: 10, name: levelNames.level10 || "Level 10" },
  ];

  // Pass 1: Position all children around their parents
  levelData.forEach(({ items, level, name }) => {
    Object.entries(items).forEach(([parentId, nodeItems]) => {
      const parentNode = nodes.find(n => n.id === parentId);
      if (parentNode && nodeItems) {
        positionChildrenAroundParent(parentNode, nodeItems, level, name);
      }
    });
  });

  // Pass 2: Center all parents between their children
  // Process in reverse level order to handle nested centering
  for (let level = 1; level <= 10; level++) {
    const levelNodes = nodes.filter(n => n.level === level);
    levelNodes.forEach(centerParentBetweenChildren);
  }

  // Pass 3: Create all connections using final node positions
  nodes.forEach(node => {
    if (node.parentId) {
      const parentNode = nodes.find(n => n.id === node.parentId);
      if (parentNode) {
        connections.push(createConnection(parentNode, node));
      }
    }
  });

  // Adjust spacing between level 1 groups to prevent overlap
  const level1Nodes = nodes.filter(n => n.level === 1).sort((a, b) => a.y - b.y);
  let currentMaxY = 0;
  
  level1Nodes.forEach(level1Node => {
    const allDescendants = nodes.filter(n => {
      // Find all nodes that are descendants of this level1 node
      let current = n;
      while (current.parentId) {
        current = nodes.find(node => node.id === current.parentId) || current;
        if (current.id === level1Node.id) return true;
        if (!current.parentId) break;
      }
      return false;
    });
    
    const groupNodes = [level1Node, ...allDescendants];
    const groupMinY = Math.min(...groupNodes.map(n => n.y));
    const groupMaxY = Math.max(...groupNodes.map(n => n.y + NODE_HEIGHT));
    
    if (groupMinY < currentMaxY) {
      const adjustment = currentMaxY - groupMinY + GROUP_SPACING;
      groupNodes.forEach(node => {
        node.y += adjustment;
      });
    }
    
    currentMaxY = Math.max(...groupNodes.map(n => n.y + NODE_HEIGHT));
  });

  // Update connections after final positioning
  connections.length = 0;
  nodes.forEach(node => {
    if (node.parentId) {
      const parentNode = nodes.find(n => n.id === node.parentId);
      if (parentNode) {
        connections.push(createConnection(parentNode, node));
      }
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
