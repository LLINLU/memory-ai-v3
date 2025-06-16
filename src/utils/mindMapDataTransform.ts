
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
  children_count?: number;
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

const NODE_WIDTH = 280;
const ROOT_NODE_WIDTH = 280;
const NODE_HEIGHT = 60;
const ROOT_NODE_HEIGHT = 70;

// Layout-specific margin constants
const HORIZONTAL_MARGIN_TOP = 200;
const HORIZONTAL_MARGIN_LEFT = 50;
const VERTICAL_MARGIN_TOP = 50;
const VERTICAL_MARGIN_LEFT = 200;

// Helper function to find the last selected node ID and level
const findLastSelectedNode = (selectedPath: any) => {
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

  const hierarchy: any = {
    id: "root",
    name: query || "Research Query",
    description: "Your research query",
    level: 0,
    levelName: "Query",
    isSelected: false,
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

  // Configure nodeSize based on layout direction
  const nodeSize = layoutDirection === 'horizontal' ? [50, 400] : [200, 80];
  
  const treeLayout = d3
    .tree()
    .nodeSize(nodeSize)
    .separation((a, b) => {
      if (
        a.parent &&
        a.parent.depth === 0 &&
        b.parent &&
        b.parent.depth === 0
      ) {
        return 1.0;
      }

      if (a.depth === 2 && b.depth === 2) {
        return layoutDirection === 'horizontal' ? 1.3 : 1.5;
      }

      const maxDepth = Math.max(a.depth, b.depth);
      if (maxDepth <= 3) return layoutDirection === 'horizontal' ? 1.5 : 1.8;
      return layoutDirection === 'horizontal' ? 1.8 : 2.0;
    });

  treeLayout(root);

  // Calculate positions based on layout direction
  const marginTop = layoutDirection === 'horizontal' ? HORIZONTAL_MARGIN_TOP : VERTICAL_MARGIN_TOP;
  const marginLeft = layoutDirection === 'horizontal' ? HORIZONTAL_MARGIN_LEFT : VERTICAL_MARGIN_LEFT;

  const nodes = root.descendants().map((node) => ({
    id: node.data.id,
    name: node.data.name,
    description: node.data.description,
    level: node.data.level,
    levelName: node.data.levelName,
    x: layoutDirection === 'horizontal' ? node.y + marginLeft : node.x + marginLeft,
    y: layoutDirection === 'horizontal' ? node.x + marginTop : node.y + marginTop,
    parentId: node.parent ? node.parent.data.id : undefined,
    isSelected: node.data.isSelected,
    isCustom: node.data.isCustom,
    children_count: node.data.children_count,
  }));

  return nodes;
};

// Helper function to create connections from D3 hierarchy
const createD3Connections = (hierarchicalData: any, layoutDirection: 'horizontal' | 'vertical' = 'horizontal'): MindMapConnection[] => {
  if (!hierarchicalData.children || hierarchicalData.children.length === 0) {
    return [];
  }

  const root = d3.hierarchy(hierarchicalData);

  // Configure nodeSize based on layout direction (same as createD3Nodes)
  const nodeSize = layoutDirection === 'horizontal' ? [50, 400] : [200, 80];
  
  const treeLayout = d3
    .tree()
    .nodeSize(nodeSize)
    .separation((a, b) => {
      if (
        a.parent &&
        a.parent.depth === 0 &&
        b.parent &&
        b.parent.depth === 0
      ) {
        return 1.0;
      }

      if (a.depth === 2 && b.depth === 2) {
        return layoutDirection === 'horizontal' ? 1.3 : 1.5;
      }

      const maxDepth = Math.max(a.depth, b.depth);
      if (maxDepth <= 3) return layoutDirection === 'horizontal' ? 1.5 : 1.8;
      return layoutDirection === 'horizontal' ? 1.8 : 2.0;
    });

  treeLayout(root);

  const connections: MindMapConnection[] = [];
  const marginTop = layoutDirection === 'horizontal' ? HORIZONTAL_MARGIN_TOP : VERTICAL_MARGIN_TOP;
  const marginLeft = layoutDirection === 'horizontal' ? HORIZONTAL_MARGIN_LEFT : VERTICAL_MARGIN_LEFT;

  root.links().forEach((link) => {
    const isRootSource = link.source.data.level === 0;
    const sourceNodeWidth = isRootSource ? ROOT_NODE_WIDTH : NODE_WIDTH;
    const sourceNodeHeight = isRootSource ? ROOT_NODE_HEIGHT : NODE_HEIGHT;

    let sourceX, sourceY, targetX, targetY;

    if (layoutDirection === 'horizontal') {
      // Horizontal layout: connections go from right edge to left edge
      sourceX = link.source.y + marginLeft + sourceNodeWidth;
      sourceY = link.source.x + marginTop + sourceNodeHeight / 2;
      targetX = link.target.y + marginLeft;
      targetY = link.target.x + marginTop + NODE_HEIGHT / 2;
    } else {
      // Vertical layout: connections go from bottom edge to top edge
      sourceX = link.source.x + marginLeft + sourceNodeWidth / 2;
      sourceY = link.source.y + marginTop + sourceNodeHeight;
      targetX = link.target.x + marginLeft + NODE_WIDTH / 2;
      targetY = link.target.y + marginTop;
    }

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
  selectedPath: any,
  query: string = "Research Query",
  layoutDirection: 'horizontal' | 'vertical' = 'horizontal'
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

  // Create nodes and connections using D3 tree layout with specified direction
  const nodes = createD3Nodes(hierarchicalData, layoutDirection);
  const connections = createD3Connections(hierarchicalData, layoutDirection);

  return { nodes, connections };
};
