import { TreeNode } from "@/types/tree";
import * as d3 from "d3";

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
  children_count?: number; // Number of children nodes, 0 indicates generation in progress
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

const NODE_WIDTH = 280; // Changed from 220 to 280 to match root width
const ROOT_NODE_WIDTH = 280;
const NODE_HEIGHT = 60; // Reduced from 100 to 60
const ROOT_NODE_HEIGHT = 70; // Reduced from 120 to 70

// Margin constants for better spacing
const MARGIN_TOP = 200; // Increased from 50 to 200 to position root node lower
const MARGIN_LEFT = 50; // Reduced from 300 to 50 to move root node to the LEFT side of canvas
const MARGIN_RIGHT = 100;
const MARGIN_BOTTOM = 50;

// Helper function to find the last selected node ID and level
const findLastSelectedNode = (selectedPath: any) => {
  // Check from highest level down to find the last non-empty selection
  if (selectedPath.level10) return { id: selectedPath.level10, level: 10 };
  if (selectedPath.level9) return { id: selectedPath.level9, level: 9 };
  if (selectedPath.level8) return { id: selectedPath.level8, level: 8 };
  if (selectedPath.level7) return { id: selectedPath.level7, level: 7 };
  if (selectedPath.level6) return { id: selectedPath.level6, level: 6 };
  if (selectedPath.level5) return { id: selectedPath.level5, level: 5 };
  if (selectedPath.level4) return { id: selectedPath.level4, level: 4 };
  if (selectedPath.level3) return { id: selectedPath.level3, level: 3 };
  if (selectedPath.level2) return { id: selectedPath.level2, level: 2 };
  if (selectedPath.level1) return { id: selectedPath.level1, level: 1 };
  return null;
};

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
  selectedPath: any,
  query: string
) => {
  // Find the single node that should be selected
  const lastSelectedNode = findLastSelectedNode(selectedPath);
  //console.log("MindMap Selection: Last selected node:", lastSelectedNode);

  const hierarchy: any = {
    id: "root",
    name: query || "Research Query",
    description: "Your research query",
    level: 0,
    levelName: "Query",
    isSelected: false, // Root is never selected
    isCustom: false,
    children: [],
  };
  // Add level 1 items as direct children of root
  level1Items.forEach((item) => {
    const level1Node = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level: 1,
      levelName: levelNames.level1 || "Level 1",
      isSelected:
        lastSelectedNode?.id === item.id && lastSelectedNode?.level === 1,
      isCustom: item.isCustom || false,
      children_count: item.children_count,
      children: [],
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
        isSelected:
          lastSelectedNode?.id === level2Item.id &&
          lastSelectedNode?.level === 2,
        isCustom: level2Item.isCustom || false,
        children_count: level2Item.children_count,
        children: [],
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
          isSelected:
            lastSelectedNode?.id === level3Item.id &&
            lastSelectedNode?.level === 3,
          isCustom: level3Item.isCustom || false,
          children_count: level3Item.children_count,
          children: [],
        };

        // Add level 4+ items recursively
        addChildrenRecursively(
          level3Node,
          level3Item.id,
          4,
          [
            level4Items,
            level5Items,
            level6Items,
            level7Items,
            level8Items,
            level9Items,
            level10Items,
          ],
          levelNames,
          lastSelectedNode
        );

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
  lastSelectedNode: { id: string; level: number } | null
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
      isSelected:
        lastSelectedNode?.id === item.id &&
        lastSelectedNode?.level === currentLevel,
      isCustom: item.isCustom || false,
      children_count: item.children_count,
      children: [],
    };

    // Recursively add children for the next level
    addChildrenRecursively(
      childNode,
      item.id,
      currentLevel + 1,
      levelItemsArray,
      levelNames,
      lastSelectedNode
    );
    parentNode.children.push(childNode);
  });
};

// Helper function to create D3 nodes from hierarchical data
const createD3Nodes = (hierarchicalData: any, layoutDirection: 'horizontal' | 'vertical' = 'horizontal'): MindMapNode[] => {
  if (!hierarchicalData.children || hierarchicalData.children.length === 0) {
    return [];
  }

  const root = d3.hierarchy(hierarchicalData);

  if (layoutDirection === 'horizontal') {
    // KEEP EXACTLY AS IS - don't change anything for horizontal layout
    const treeLayout = d3
      .tree()
      .nodeSize([50, 400]) // Keep current nodeSize for good horizontal spacing
      .separation((a, b) => {
        // Keep tight spacing for level 1 nodes (children of root)
        if (
          a.parent &&
          a.parent.depth === 0 &&
          b.parent &&
          b.parent.depth === 0
        ) {
          return 1.0; // Keep current tight spacing for level1
        }

        // Specific spacing for level 2 nodes to prevent crowding
        if (a.depth === 2 && b.depth === 2) {
          return 1.3; // Increased spacing specifically for level2 green nodes
        }

        // Progressive spacing for deeper levels
        const maxDepth = Math.max(a.depth, b.depth);
        if (maxDepth <= 3) return 1.5; // Level3 gets more space
        return 1.8; // Level4+ gets maximum space
      });

    treeLayout(root);
    
    // Include ALL nodes including the root (depth 0) - KEEP current horizontal logic unchanged
    return root.descendants().map((node) => ({
      id: node.data.id,
      name: node.data.name,
      description: node.data.description,
      level: node.data.level,
      levelName: node.data.levelName,
      x: node.y + MARGIN_LEFT, // Keep current horizontal logic
      y: node.x + MARGIN_TOP,   // Keep current horizontal logic
      parentId: node.parent ? node.parent.data.id : undefined,
      isSelected: node.data.isSelected,
      isCustom: node.data.isCustom,
      children_count: node.data.children_count,
    }));
  } else {
    // OPTIMIZED vertical layout - better spacing for top-down flow
    const treeLayout = d3
      .tree()
      .nodeSize([80, 150]) // Optimized: more vertical distance, less horizontal distance
      .separation((a, b) => {
        // Much tighter horizontal spacing for vertical layout
        return a.parent === b.parent ? 0.6 : 0.8;
      });

    treeLayout(root);
    
    // NEW vertical coordinate mapping
    return root.descendants().map((node) => ({
      id: node.data.id,
      name: node.data.name,
      description: node.data.description,
      level: node.data.level,
      levelName: node.data.levelName,
      x: node.x + MARGIN_LEFT,  // New vertical flow - x is horizontal position
      y: node.y + MARGIN_TOP,   // New vertical flow - y is vertical position (flows downward)
      parentId: node.parent ? node.parent.data.id : undefined,
      isSelected: node.data.isSelected,
      isCustom: node.data.isCustom,
      children_count: node.data.children_count,
    }));
  }
};

// Helper function to create connections from D3 hierarchy
const createD3Connections = (hierarchicalData: any, layoutDirection: 'horizontal' | 'vertical' = 'horizontal'): MindMapConnection[] => {
  if (!hierarchicalData.children || hierarchicalData.children.length === 0) {
    return [];
  }

  const root = d3.hierarchy(hierarchicalData);

  if (layoutDirection === 'horizontal') {
    // KEEP ALL CURRENT CONNECTION LOGIC UNCHANGED for horizontal
    const treeLayout = d3
      .tree()
      .nodeSize([50, 400]) // Keep current nodeSize for good horizontal spacing
      .separation((a, b) => {
        // Keep tight spacing for level 1 nodes (children of root)
        if (
          a.parent &&
          a.parent.depth === 0 &&
          b.parent &&
          b.parent.depth === 0
        ) {
          return 1.0; // Keep current tight spacing for level1
        }

        // Specific spacing for level 2 nodes to prevent crowding
        if (a.depth === 2 && b.depth === 2) {
          return 1.3; // Increased spacing specifically for level2 green nodes
        }

        // Progressive spacing for deeper levels
        const maxDepth = Math.max(a.depth, b.depth);
        if (maxDepth <= 3) return 1.5; // Level3 gets more space
        return 1.8; // Level4+ gets maximum space
      });

    treeLayout(root);

    const connections: MindMapConnection[] = [];

    // Include ALL connections including from root - KEEP existing logic
    root.links().forEach((link) => {
      // Check if source is root node (level 0) to use correct width and height
      const isRootSource = link.source.data.level === 0;
      const sourceNodeWidth = isRootSource ? ROOT_NODE_WIDTH : NODE_WIDTH; // Now both are 280
      const sourceNodeHeight = isRootSource ? ROOT_NODE_HEIGHT : NODE_HEIGHT;

      // Calculate connection points with proper centering - KEEP existing logic
      const sourceX = link.source.y + MARGIN_LEFT + sourceNodeWidth; // Use new left margin
      const sourceY = link.source.x + MARGIN_TOP + sourceNodeHeight / 2; // Use correct height for centering
      const targetX = link.target.y + MARGIN_LEFT; // Use new left margin
      const targetY = link.target.x + MARGIN_TOP + NODE_HEIGHT / 2; // Use top margin

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
  } else {
    // OPTIMIZED vertical connection logic with layout-aware dimensions
    const treeLayout = d3
      .tree()
      .nodeSize([80, 150]) // Optimized: matches the node spacing
      .separation((a, b) => {
        // Much tighter horizontal spacing for vertical layout
        return a.parent === b.parent ? 0.6 : 0.8;
      });

    treeLayout(root);

    const connections: MindMapConnection[] = [];

    // NEW vertical connections - layout-aware dimensions
    root.links().forEach((link) => {
      const isRootSource = link.source.data.level === 0;
      
      // Use layout-specific dimensions
      const sourceNodeWidth = 120; // Vertical layout width
      const sourceNodeHeight = isRootSource ? 110 : 100; // Vertical layout heights
      const targetNodeWidth = 120;

      // Bottom edge of source to top edge of target
      const sourceX = link.source.x + MARGIN_LEFT + sourceNodeWidth / 2; // Center horizontally
      const sourceY = link.source.y + MARGIN_TOP + sourceNodeHeight; // Bottom edge
      const targetX = link.target.x + MARGIN_LEFT + targetNodeWidth / 2; // Center horizontally  
      const targetY = link.target.y + MARGIN_TOP; // Top edge

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
  }
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
  selectedPath: any,
  query: string = "Research Query",
  layoutDirection: 'horizontal' | 'vertical' = 'horizontal'  // Add layout direction parameter
) => {
  // Build hierarchical data structure with proper root
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
    selectedPath,
    query
  );

  // Create nodes and connections using D3 tree layout with layout direction
  const nodes = createD3Nodes(hierarchicalData, layoutDirection);
  const connections = createD3Connections(hierarchicalData, layoutDirection);

  // console.log("Level breakdown:", {
  //   root: nodes.filter((n) => n.level === 0).length,
  //   level1: nodes.filter((n) => n.level === 1).length,
  //   level2: nodes.filter((n) => n.level === 2).length,
  //   level3: nodes.filter((n) => n.level === 3).length,
  //   level4: nodes.filter((n) => n.level === 4).length,
  // });

  return { nodes, connections };
};
