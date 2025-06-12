
import { TreeNode } from "@/types/tree";
import { hierarchy, Tree } from "@visx/hierarchy";
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

  // Create hierarchy and apply tree layout
  const root = hierarchy(hierarchicalData);
  const treeLayout = Tree<MindMapNode>();
  
  // Apply the tree layout
  treeLayout(root);

  // Get all nodes and connections
  const nodes = root.descendants();
  const connections = root.links().map(link => ({
    source: link.source,
    target: link.target,
  }));

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Tree structure:', {
    totalNodes: nodes.length,
    maxDepth: Math.max(...nodes.map(n => n.depth)),
    rootChildren: root.children?.length || 0,
  });

  return { root, nodes, connections };
};
