
import { TreeNode } from "@/types/tree";
import * as d3 from 'd3';

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
  depth: number;
  children?: MindMapNode[];
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

// Convert flat tree data to hierarchical structure for D3
const convertToHierarchy = (
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
  // Create a root node to hold all level 1 items
  const root = {
    id: 'root',
    name: 'Root',
    description: '',
    level: 0,
    levelName: 'Root',
    isSelected: false,
    isCustom: false,
    children: [] as any[]
  };

  // Helper function to build tree recursively
  const buildTree = (items: TreeNode[], level: number, levelName: string, childrenMap: Record<string, TreeNode[]>) => {
    return items.map(item => {
      const node = {
        id: item.id,
        name: item.name,
        description: item.description || "",
        level,
        levelName,
        isSelected: selectedPath[`level${level}`] === item.id,
        isCustom: item.isCustom || false,
        children: [] as any[]
      };

      // Add children if they exist
      const children = childrenMap[item.id];
      if (children && children.length > 0) {
        const nextLevelMap = getNextLevelMap(level);
        if (nextLevelMap) {
          node.children = buildTree(children, level + 1, levelNames[`level${level + 1}`] || `Level ${level + 1}`, nextLevelMap);
        }
      }

      return node;
    });
  };

  // Helper to get the next level's children map
  const getNextLevelMap = (currentLevel: number) => {
    switch (currentLevel) {
      case 1: return level2Items;
      case 2: return level3Items;
      case 3: return level4Items;
      case 4: return level5Items;
      case 5: return level6Items;
      case 6: return level7Items;
      case 7: return level8Items;
      case 8: return level9Items;
      case 9: return level10Items;
      default: return {};
    }
  };

  // Build the tree starting from level 1
  root.children = buildTree(level1Items, 1, levelNames.level1 || "Level 1", level2Items);

  return root;
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
) => {
  const nodes: MindMapNode[] = [];
  const connections: MindMapConnection[] = [];

  // Convert to hierarchical structure
  const hierarchyData = convertToHierarchy(
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

  // If no data, return empty arrays
  if (!hierarchyData.children || hierarchyData.children.length === 0) {
    return { nodes, connections };
  }

  // Create D3 hierarchy
  const root = d3.hierarchy(hierarchyData);

  // Configure D3 tree layout
  const width = 1400;
  const height = 800;
  const margin = { top: 50, left: 80, right: 80, bottom: 50 };

  const treeLayout = d3.tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.2);

  // Apply layout
  treeLayout(root);

  // Convert D3 nodes to our format (skip root node)
  root.descendants().forEach((d3Node) => {
    if (d3Node.depth === 0) return; // Skip root

    const node: MindMapNode = {
      id: d3Node.data.id,
      name: d3Node.data.name,
      description: d3Node.data.description,
      level: d3Node.data.level,
      levelName: d3Node.data.levelName,
      x: d3Node.y + margin.left, // D3 uses y for horizontal position
      y: d3Node.x + margin.top,  // D3 uses x for vertical position
      parentId: d3Node.parent?.data.id,
      isSelected: d3Node.data.isSelected,
      isCustom: d3Node.data.isCustom,
      depth: d3Node.depth
    };

    nodes.push(node);
  });

  // Create connections using D3 links (skip root connections)
  root.links().forEach((link) => {
    if (link.source.depth === 0) return; // Skip root connections

    const sourceNode = nodes.find(n => n.id === link.source.data.id);
    const targetNode = nodes.find(n => n.id === link.target.data.id);

    if (sourceNode && targetNode) {
      // Calculate connection points for rectangular nodes
      const nodeWidth = 200;
      const nodeHeight = 80;

      const connection: MindMapConnection = {
        id: `${sourceNode.id}-${targetNode.id}`,
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        sourceX: sourceNode.x + nodeWidth / 2,
        sourceY: sourceNode.y + nodeHeight / 2,
        targetX: targetNode.x - nodeWidth / 2,
        targetY: targetNode.y + nodeHeight / 2,
      };

      connections.push(connection);
    }
  });

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections using D3 layout`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
