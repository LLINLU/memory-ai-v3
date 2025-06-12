
import { MindMapNode } from "@/hooks/tree/useMindMapState";

export const transformToMindMapData = (
  level1Items: any[],
  level2Items: Record<string, any[]>,
  level3Items: Record<string, any[]>,
  level4Items: Record<string, any[]>,
  level5Items: Record<string, any[]> = {},
  level6Items: Record<string, any[]> = {},
  level7Items: Record<string, any[]> = {},
  level8Items: Record<string, any[]> = {},
  level9Items: Record<string, any[]> = {},
  level10Items: Record<string, any[]> = {},
  expandedNodes: Set<string>
): MindMapNode[] => {
  const buildNode = (item: any, level: number, getChildren: () => any[]): MindMapNode => {
    const children = getChildren();
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      info: item.info,
      isCustom: item.isCustom,
      level,
      children: children.map(child => buildNodeRecursively(child, level + 1)),
      isExpanded: expandedNodes.has(item.id),
    };
  };

  const buildNodeRecursively = (item: any, level: number): MindMapNode => {
    const itemsMap = [
      {},
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

    const currentLevelItems = itemsMap[level] || {};
    const children = currentLevelItems[item.id] || [];

    return buildNode(item, level, () => children);
  };

  return level1Items.map(item => buildNodeRecursively(item, 1));
};

export const calculateNodePositions = (
  nodes: MindMapNode[],
  containerWidth: number = 1200,
  containerHeight: number = 800
): MindMapNode[] => {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  
  const positionNode = (
    node: MindMapNode,
    x: number,
    y: number,
    angle: number = 0,
    radius: number = 150
  ): MindMapNode => {
    const positionedNode = {
      ...node,
      x,
      y,
      children: [],
    };

    if (node.isExpanded && node.children.length > 0) {
      const angleStep = (Math.PI * 2) / Math.max(node.children.length, 3);
      const childRadius = radius * 0.8;

      positionedNode.children = node.children.map((child, index) => {
        const childAngle = angle + (index - (node.children.length - 1) / 2) * angleStep;
        const childX = x + Math.cos(childAngle) * childRadius;
        const childY = y + Math.sin(childAngle) * childRadius;

        return positionNode(child, childX, childY, childAngle, childRadius);
      });
    }

    return positionedNode;
  };

  if (nodes.length === 0) return [];

  // Position root node at center
  const rootNode = positionNode(nodes[0], centerX, centerY);
  
  return [rootNode];
};
