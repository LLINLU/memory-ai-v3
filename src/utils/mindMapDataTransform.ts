
import { TreeNode } from "@/types/tree";
import { hierarchy } from "@visx/hierarchy";
import { Tree } from "@visx/hierarchy";
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

export interface MindMapData {
  root: HierarchyPointNode<MindMapNode>;
  nodes: HierarchyPointNode<MindMapNode>[];
  connections: Array<{
    source: HierarchyPointNode<MindMapNode>;
    target: HierarchyPointNode<MindMapNode>;
  }>;
}

// Convert complex level-based data to simple hierarchical tree
const buildSimpleHierarchy = (
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
  // Handle empty data
  if (!level1Items || level1Items.length === 0) {
    return {
      id: "empty",
      name: "No data available",
      description: "",
      level: 0,
      levelName: "Root",
      children: [],
    };
  }

  // Single root case
  if (level1Items.length === 1) {
    return buildNodeRecursively(
      level1Items[0],
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

  // Multiple roots - create virtual root
  return {
    id: "root",
    name: "Technology Tree",
    description: "Root of technology tree",
    level: 0,
    levelName: "Root",
    isSelected: false,
    children: level1Items.map((item) =>
      buildNodeRecursively(
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

const buildNodeRecursively = (
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
  // Get children for current level
  let childItems: TreeNode[] = [];
  const levelKey = `level${level + 1}Items` as keyof typeof allLevelItems;
  
  if (level < 10 && allLevelItems[levelKey]) {
    childItems = allLevelItems[levelKey][item.id] || [];
  }

  const node: MindMapNode = {
    id: item.id,
    name: item.name,
    description: item.description || "",
    level,
    levelName,
    isSelected: selectedPath[`level${level}`] === item.id,
    isCustom: item.isCustom || false,
    children: childItems.map((child) =>
      buildNodeRecursively(
        child,
        level + 1,
        levelNames[`level${level + 1}`] || `Level ${level + 1}`,
        selectedPath,
        allLevelItems,
        levelNames
      )
    ),
  };

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
  // Build simple hierarchical structure
  const treeData = buildSimpleHierarchy(
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

  // Create hierarchy and apply visx Tree layout
  const root = hierarchy(treeData);
  const treeLayout = Tree<MindMapNode>({
    size: [800, 600], // [width, height]
    separation: (a, b) => (a.parent === b.parent ? 1 : 2) / a.depth,
  });

  // Apply layout to get positioned nodes
  const layoutRoot = treeLayout(root);

  // Get all nodes and links
  const nodes = layoutRoot.descendants();
  const connections = layoutRoot.links().map((link) => ({
    source: link.source,
    target: link.target,
  }));

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections using visx Tree layout`);

  return {
    root: layoutRoot,
    nodes,
    connections,
  };
};
