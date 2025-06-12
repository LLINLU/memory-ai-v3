import { TreeNode } from "@/types/tree";
import { hierarchy } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";

export interface MindMapNode {
  id: string;
  name: string;
  description: string;
  level: number;
  levelName: string;
  isSelected?: boolean;
  isCustom?: boolean;
  children?: MindMapNode[];
}

export interface MindMapConnection {
  source: HierarchyPointNode<MindMapNode>;
  target: HierarchyPointNode<MindMapNode>;
}

export interface MindMapData {
  root: HierarchyPointNode<MindMapNode>;
  nodes: HierarchyPointNode<MindMapNode>[];
  connections: MindMapConnection[];
}

const buildHierarchicalTree = (
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
): MindMapNode => {
  // Create a virtual root if we have multiple level 1 items
  if (level1Items.length === 0) {
    return {
      id: "empty",
      name: "No data",
      description: "",
      level: 0,
      levelName: "Root",
      children: [],
    };
  }

  // If only one level 1 item, use it as root
  if (level1Items.length === 1) {
    const rootItem = level1Items[0];
    return buildNodeWithChildren(
      rootItem,
      1,
      levelNames.level1 || "Level 1",
      selectedPath,
      {
        level2Items,
        level3Items,
        level4Items,
        level5Items,
        level6Items,
        level7Items,
        level8Items,
        level9Items,
        level10Items,
      },
      levelNames
    );
  }

  // Multiple level 1 items - create virtual root
  return {
    id: "root",
    name: "技術ツリー",
    description: "Technology Tree Root",
    level: 0,
    levelName: "Root",
    isSelected: false,
    children: level1Items.map((item) =>
      buildNodeWithChildren(
        item,
        1,
        levelNames.level1 || "Level 1",
        selectedPath,
        {
          level2Items,
          level3Items,
          level4Items,
          level5Items,
          level6Items,
          level7Items,
          level8Items,
          level9Items,
          level10Items,
        },
        levelNames
      )
    ),
  };
};

const buildNodeWithChildren = (
  item: TreeNode,
  level: number,
  levelName: string,
  selectedPath: any,
  allLevelItems: {
    level2Items: Record<string, TreeNode[]>;
    level3Items: Record<string, TreeNode[]>;
    level4Items: Record<string, TreeNode[]>;
    level5Items: Record<string, TreeNode[]>;
    level6Items: Record<string, TreeNode[]>;
    level7Items: Record<string, TreeNode[]>;
    level8Items: Record<string, TreeNode[]>;
    level9Items: Record<string, TreeNode[]>;
    level10Items: Record<string, TreeNode[]>;
  },
  levelNames: Record<string, string>
): MindMapNode => {
  const node: MindMapNode = {
    id: item.id,
    name: item.name,
    description: item.description || "",
    level,
    levelName,
    isSelected: selectedPath[`level${level}`] === item.id,
    isCustom: item.isCustom || false,
    children: [],
  };

  // Get children for this node based on level
  let childItems: TreeNode[] = [];
  let nextLevel = level + 1;
  let nextLevelName = levelNames[`level${nextLevel}`] || `Level ${nextLevel}`;

  switch (level) {
    case 1:
      childItems = allLevelItems.level2Items[item.id] || [];
      break;
    case 2:
      childItems = allLevelItems.level3Items[item.id] || [];
      break;
    case 3:
      childItems = allLevelItems.level4Items[item.id] || [];
      break;
    case 4:
      childItems = allLevelItems.level5Items[item.id] || [];
      break;
    case 5:
      childItems = allLevelItems.level6Items[item.id] || [];
      break;
    case 6:
      childItems = allLevelItems.level7Items[item.id] || [];
      break;
    case 7:
      childItems = allLevelItems.level8Items[item.id] || [];
      break;
    case 8:
      childItems = allLevelItems.level9Items[item.id] || [];
      break;
    case 9:
      childItems = allLevelItems.level10Items[item.id] || [];
      break;
    default:
      childItems = [];
  }

  // Recursively build children
  if (childItems.length > 0 && level < 10) {
    node.children = childItems.map((childItem) =>
      buildNodeWithChildren(
        childItem,
        nextLevel,
        nextLevelName,
        selectedPath,
        allLevelItems,
        levelNames
      )
    );
  }

  return node;
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
): MindMapData => {
  // Build hierarchical tree structure
  const hierarchicalData = buildHierarchicalTree(
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

  // Create hierarchy from the data
  const root = hierarchy(hierarchicalData);
  
  // Create tree layout with proper size using d3-tree layout algorithm
  const treeWidth = 800;
  const treeHeight = 600;
  
  // Apply tree layout algorithm to position nodes
  const treeWithLayout = root.copy();
  
  // Simple tree layout positioning - assign x, y coordinates
  const assignCoordinates = (node: any, depth = 0, index = 0, siblings = 1) => {
    // Horizontal positioning based on depth
    node.x = depth * (treeHeight / 6); // Spread vertically
    
    // Vertical positioning based on sibling index
    if (siblings === 1) {
      node.y = treeWidth / 2;
    } else {
      node.y = (index + 1) * (treeWidth / (siblings + 1));
    }
    
    // Recursively position children
    if (node.children) {
      node.children.forEach((child: any, i: number) => {
        assignCoordinates(child, depth + 1, i, node.children.length);
      });
    }
  };
  
  assignCoordinates(treeWithLayout);

  // Get all nodes and connections
  const nodes = treeWithLayout.descendants() as HierarchyPointNode<MindMapNode>[];
  const connections = treeWithLayout.links().map(link => ({
    source: link.source as HierarchyPointNode<MindMapNode>,
    target: link.target as HierarchyPointNode<MindMapNode>,
  }));

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Tree structure:', {
    totalNodes: nodes.length,
    maxDepth: Math.max(...nodes.map(n => n.depth)),
    rootChildren: treeWithLayout.children?.length || 0,
  });

  return { root: treeWithLayout as HierarchyPointNode<MindMapNode>, nodes, connections };
};
