
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
const LEVEL_SPACING = 250; // Horizontal spacing between levels
const MIN_SIBLING_SPACING = 120; // Minimum vertical spacing between siblings

// Tree node structure for layout algorithm
interface TreeLayoutNode {
  id: string;
  name: string;
  description: string;
  level: number;
  levelName: string;
  parentId?: string;
  isSelected?: boolean;
  isCustom?: boolean;
  children: TreeLayoutNode[];
  x: number;
  y: number;
  mod: number; // Modifier for positioning
  thread?: TreeLayoutNode;
  ancestor: TreeLayoutNode;
  change: number;
  shift: number;
  prelim: number;
}

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
  // Build hierarchical tree structure
  const buildTreeStructure = (): TreeLayoutNode[] => {
    const createTreeNode = (
      item: TreeNode,
      level: number,
      levelName: string,
      parentId?: string
    ): TreeLayoutNode => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      level,
      levelName,
      parentId,
      isSelected: selectedPath[`level${level}`] === item.id,
      isCustom: item.isCustom || false,
      children: [],
      x: 0,
      y: 0,
      mod: 0,
      ancestor: null as any, // Will be set later
      change: 0,
      shift: 0,
      prelim: 0,
    });

    // Create level 1 nodes (roots)
    const roots: TreeLayoutNode[] = level1Items.map(item => 
      createTreeNode(item, 1, levelNames.level1 || "Level 1")
    );

    // Set ancestor reference for roots
    roots.forEach(root => {
      root.ancestor = root;
    });

    // Helper function to add children recursively
    const addChildren = (
      parent: TreeLayoutNode,
      levelItems: Record<string, TreeNode[]>,
      level: number,
      levelName: string,
      nextLevelItems?: Record<string, TreeNode[]>
    ) => {
      const children = levelItems[parent.id] || [];
      parent.children = children.map(child => {
        const childNode = createTreeNode(child, level, levelName, parent.id);
        childNode.ancestor = childNode;
        
        // Recursively add children if next level exists
        if (nextLevelItems && level < 10) {
          addChildren(childNode, nextLevelItems, level + 1, levelNames[`level${level + 1}`] || `Level ${level + 1}`);
        }
        
        return childNode;
      });
    };

    // Build the complete tree structure
    const levelData = [
      { items: level2Items, level: 2, name: levelNames.level2 || "Level 2", next: level3Items },
      { items: level3Items, level: 3, name: levelNames.level3 || "Level 3", next: level4Items },
      { items: level4Items, level: 4, name: levelNames.level4 || "Level 4", next: level5Items },
      { items: level5Items, level: 5, name: levelNames.level5 || "Level 5", next: level6Items },
      { items: level6Items, level: 6, name: levelNames.level6 || "Level 6", next: level7Items },
      { items: level7Items, level: 7, name: levelNames.level7 || "Level 7", next: level8Items },
      { items: level8Items, level: 8, name: levelNames.level8 || "Level 8", next: level9Items },
      { items: level9Items, level: 9, name: levelNames.level9 || "Level 9", next: level10Items },
      { items: level10Items, level: 10, name: levelNames.level10 || "Level 10" },
    ];

    // Process each root and its descendants
    roots.forEach(root => {
      let currentNodes = [root];
      
      levelData.forEach(({ items, level, name, next }) => {
        const nextNodes: TreeLayoutNode[] = [];
        
        currentNodes.forEach(node => {
          addChildren(node, items, level, name, next);
          nextNodes.push(...node.children);
        });
        
        currentNodes = nextNodes;
      });
    });

    return roots;
  };

  // Buchheim tree layout algorithm (simplified version)
  const layoutTree = (trees: TreeLayoutNode[]): void => {
    let globalY = 50; // Starting Y position
    
    trees.forEach((tree, treeIndex) => {
      // First pass: calculate preliminary x positions
      firstWalk(tree);
      
      // Second pass: calculate final positions
      const minX = findMinX(tree, 0);
      secondWalk(tree, -minX + 50, globalY); // 50px left margin
      
      // Update global Y for next tree
      const treeHeight = getTreeHeight(tree);
      globalY += treeHeight + (treeIndex < trees.length - 1 ? 200 : 0); // 200px spacing between trees
    });
  };

  const firstWalk = (node: TreeLayoutNode): void => {
    if (node.children.length === 0) {
      // Leaf node
      node.prelim = 0;
    } else {
      // Internal node
      node.children.forEach(child => firstWalk(child));
      
      const leftmost = node.children[0];
      const rightmost = node.children[node.children.length - 1];
      
      // Position node at the center of its children
      node.prelim = (leftmost.prelim + rightmost.prelim) / 2;
      
      // Separate children
      separateChildren(node);
    }
  };

  const separateChildren = (node: TreeLayoutNode): void => {
    for (let i = 1; i < node.children.length; i++) {
      const left = node.children[i - 1];
      const right = node.children[i];
      
      const separation = MIN_SIBLING_SPACING;
      const distance = right.prelim - left.prelim;
      
      if (distance < separation) {
        const adjustment = separation - distance;
        right.prelim += adjustment;
        right.mod += adjustment;
        
        // Shift all subsequent children
        for (let j = i; j < node.children.length; j++) {
          node.children[j].shift += adjustment;
        }
      }
    }
  };

  const secondWalk = (node: TreeLayoutNode, modSum: number, y: number): void => {
    node.x = LEVEL_SPACING * (node.level - 1) + 50; // Horizontal position based on level
    node.y = node.prelim + modSum + y; // Vertical position
    
    node.children.forEach(child => {
      secondWalk(child, modSum + node.mod, y);
    });
  };

  const findMinX = (node: TreeLayoutNode, currentMin: number): number => {
    let min = Math.min(currentMin, node.prelim);
    node.children.forEach(child => {
      min = findMinX(child, min);
    });
    return min;
  };

  const getTreeHeight = (node: TreeLayoutNode): number => {
    if (node.children.length === 0) {
      return NODE_HEIGHT;
    }
    
    const childHeights = node.children.map(child => getTreeHeight(child));
    const totalChildHeight = childHeights.reduce((sum, height) => sum + height, 0);
    const spacingHeight = (node.children.length - 1) * MIN_SIBLING_SPACING;
    
    return Math.max(NODE_HEIGHT, totalChildHeight + spacingHeight);
  };

  // Convert tree nodes to flat arrays
  const flattenTree = (trees: TreeLayoutNode[]): { nodes: MindMapNode[], connections: MindMapConnection[] } => {
    const nodes: MindMapNode[] = [];
    const connections: MindMapConnection[] = [];

    const traverse = (node: TreeLayoutNode) => {
      // Add node
      nodes.push({
        id: node.id,
        name: node.name,
        description: node.description,
        level: node.level,
        levelName: node.levelName,
        x: node.x,
        y: node.y,
        parentId: node.parentId,
        isSelected: node.isSelected,
        isCustom: node.isCustom,
      });

      // Add connections and traverse children
      node.children.forEach(child => {
        connections.push({
          id: `${node.id}-${child.id}`,
          sourceId: node.id,
          targetId: child.id,
          sourceX: node.x + NODE_WIDTH,
          sourceY: node.y + NODE_HEIGHT / 2,
          targetX: child.x,
          targetY: child.y + NODE_HEIGHT / 2,
        });

        traverse(child);
      });
    };

    trees.forEach(tree => traverse(tree));
    return { nodes, connections };
  };

  // Main execution
  const trees = buildTreeStructure();
  
  if (trees.length === 0) {
    console.log('Mindmap: No tree data available');
    return { nodes: [], connections: [] };
  }

  layoutTree(trees);
  const { nodes, connections } = flattenTree(trees);

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
