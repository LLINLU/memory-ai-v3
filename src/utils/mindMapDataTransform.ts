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
  isExpanded?: boolean; 
  hasChildren?: boolean; 
  hasChildrenInOriginalData?: boolean; 
  totalChildrenCount?: number;
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

//仮で現在の型に合わせる（後で修正）
interface SelectedPath {
  level1?: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level5?: string;
  level6?: string;
  level7?: string;
  level8?: string;
  level9?: string;
  level10?: string;
}

interface HierarchicalNode {
  id: string;
  name: string;
  description: string;
  level: number;
  levelName: string;
  isSelected: boolean;
  isCustom: boolean;
  children_count?: number;
  children: HierarchicalNode[];
}

const findLastSelectedNode = (selectedPath: SelectedPath) => {
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

// ノードが展開されているかどうかを確認
const isNodeExpanded = (nodeId: string, expandedNodes?: Set<string>): boolean => {
  return !expandedNodes || expandedNodes.size === 0 || expandedNodes.has(nodeId);
};

// ノードデータを作成
const createHierarchicalNode = (
  item: TreeNode,
  level: number,
  levelName: string,
  lastSelectedNode: { id: string; level: number } | null
): HierarchicalNode => {
  return {
    id: item.id,
    name: item.name,
    description: item.description || "",
    level,
    levelName,
    isSelected: lastSelectedNode?.id === item.id && lastSelectedNode?.level === level,
    isCustom: item.isCustom || false,
    children_count: item.children_count,
    children: [],
  };
};

// ノードデータを階層化する
const buildHierarchyWithExpandState = (
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
  selectedPath: SelectedPath,
  query: string,
  expandedNodes?: Set<string>
): HierarchicalNode => {
  // レベルごとのノードデータを作成
  const allLevelItems = [
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
  ];

  const lastSelectedNode = findLastSelectedNode(selectedPath);

  // ルートノードを作成
  const hierarchy: HierarchicalNode = {
    id: "root",
    name: query || "Research Query",
    description: "Your research query",
    level: 0,
    levelName: "Query",
    isSelected: false,
    isCustom: false,
    children: [],
  };

  // ノードデータを階層化する
  const buildLevelRecursively = (
    parentNode: HierarchicalNode,
    parentId: string,
    currentLevel: number
  ): void => {
    // 最大レベルを超えたら終了
    if (currentLevel > 10) return;

    // 親ノードが展開されているかどうかを確認
    if (!isNodeExpanded(parentId, expandedNodes)) return;

    // 現在のレベルのノードデータを取得
    const currentLevelData = allLevelItems[currentLevel - 1];
    let itemsForParent: TreeNode[] = [];

    if (currentLevel === 1) {
      // level 1のノードデータは直接取得
      itemsForParent = currentLevelData as TreeNode[];
    } else {
      // level 2+のノードデータは親ノードのIDで取得
      const levelItemsRecord = currentLevelData as Record<string, TreeNode[]>;
      itemsForParent = levelItemsRecord[parentId] || [];
    }

    // 現在のレベルのノードデータを処理
    itemsForParent.forEach((item) => {
      const levelName = levelNames[`level${currentLevel}`] || `Level ${currentLevel}`;
      const childNode = createHierarchicalNode(item, currentLevel, levelName, lastSelectedNode);

      // 子ノードを再帰的に追加
      buildLevelRecursively(childNode, item.id, currentLevel + 1);

      parentNode.children.push(childNode);
    });
  };

  // level 1からノードデータを階層化
  buildLevelRecursively(hierarchy, "root", 1);

  return hierarchy;
};



// 元データで子ノードがあるかどうかを確認する
const hasChildrenInOriginalHierarchy = (nodeId: string, originalHierarchy: HierarchicalNode): boolean => {
  const findNodeAndCheckChildren = (node: HierarchicalNode): boolean | undefined => {
    if (node.id === nodeId) {
      return node.children && node.children.length > 0;
    }
    
    for (const child of node.children || []) {
      const result = findNodeAndCheckChildren(child);
      if (result !== undefined) {
        return result;
      }
    }
    
    return undefined;
  };
  
  const result = findNodeAndCheckChildren(originalHierarchy);
  return result === true;
};

// 元データでの総子ノード数をカウントする
const countTotalChildrenInOriginalHierarchy = (nodeId: string, originalHierarchy: HierarchicalNode): number => {
  const findNodeAndCountChildren = (node: HierarchicalNode): number | undefined => {
    if (node.id === nodeId) {
      const countDescendants = (n: HierarchicalNode): number => {
        let count = n.children ? n.children.length : 0;
        if (n.children) {
          for (const child of n.children) {
            count += countDescendants(child);
          }
        }
        return count;
      };
      return countDescendants(node);
    }
    
    for (const child of node.children || []) {
      const result = findNodeAndCountChildren(child);
      if (result !== undefined) {
        return result;
      }
    }
    
    return undefined;
  };
  
  const result = findNodeAndCountChildren(originalHierarchy);
  return result || 0;
};

// Helper function to create D3 nodes from hierarchical data
const createD3Nodes = (hierarchicalData: HierarchicalNode, layoutDirection: 'horizontal' | 'vertical' = 'horizontal', originalHierarchy?: HierarchicalNode, expandedNodes?: Set<string>): MindMapNode[] => {
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
      hasChildren: node.children && node.children.length > 0, // 子ノードがあるかどうか
      hasChildrenInOriginalData: originalHierarchy ? hasChildrenInOriginalHierarchy(node.data.id, originalHierarchy) : (node.children && node.children.length > 0),
      isExpanded: !expandedNodes || expandedNodes.size === 0 || expandedNodes.has(node.data.id),
      totalChildrenCount: originalHierarchy ? countTotalChildrenInOriginalHierarchy(node.data.id, originalHierarchy) : 0,
    }));
  } else {
    // IMPROVED vertical layout - increased spacing to prevent overlaps
    const treeLayout = d3
      .tree()
      .nodeSize([150, 200])
      .separation((a, b) => {
        if (a.parent === b.parent) {
          return 1.5;
        } else {
          return 2.0;
        }
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
      hasChildren: node.children && node.children.length > 0, // 子ノードがあるかどうか
      hasChildrenInOriginalData: originalHierarchy ? hasChildrenInOriginalHierarchy(node.data.id, originalHierarchy) : (node.children && node.children.length > 0), // 元データで子ノードがあるかどうか
      isExpanded: !expandedNodes || expandedNodes.size === 0 || expandedNodes.has(node.data.id), // 実際の展開状態
      totalChildrenCount: originalHierarchy ? countTotalChildrenInOriginalHierarchy(node.data.id, originalHierarchy) : 0, // 元データでの総子ノード数
    }));
  }
};

// Helper function to create connections from D3 hierarchy
const createD3Connections = (hierarchicalData: HierarchicalNode, layoutDirection: 'horizontal' | 'vertical' = 'horizontal'): MindMapConnection[] => {
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
    // IMPROVED vertical connection logic with better spacing
    const treeLayout = d3
      .tree()
      .nodeSize([150, 200])
      .separation((a, b) => {
        if (a.parent === b.parent) {
          return 1.5;
        } else {
          return 2.0;
        }
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
  selectedPath: SelectedPath,
  query: string = "Research Query",
  layoutDirection: 'horizontal' | 'vertical' = 'horizontal',
  expandedNodes?: Set<string> 
) => {
  const originalHierarchicalData = buildHierarchyWithExpandState(
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
    query,
    undefined // 展開状態を取得しない（展開状態はexpandedNodesで取得する）
  );

  // Build filtered hierarchical data structure with expand state
  const hierarchicalData = buildHierarchyWithExpandState(
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
    query,
    expandedNodes
  );

  // Create nodes and connections using D3 tree layout with layout direction
  const nodes = createD3Nodes(hierarchicalData, layoutDirection, originalHierarchicalData, expandedNodes);
  const connections = createD3Connections(hierarchicalData, layoutDirection);


  return { nodes, connections };
};
