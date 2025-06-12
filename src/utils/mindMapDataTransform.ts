
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
  console.log("🗺️ Mindmap Transform Input:", {
    level1Count: level1Items?.length || 0,
    level2Count: Object.keys(level2Items || {}).length,
    level3Count: Object.keys(level3Items || {}).length,
    level4Count: Object.keys(level4Items || {}).length,
    expandedNodes: Array.from(expandedNodes),
    level1Items: level1Items?.slice(0, 2), // First 2 items for debugging
  });

  // Validate input data
  if (!level1Items || level1Items.length === 0) {
    console.warn("⚠️ No level1Items provided to mindmap transform");
    return [];
  }

  const buildNode = (item: any, level: number, getChildren: () => any[]): MindMapNode => {
    const children = getChildren();
    const node = {
      id: item.id,
      name: item.name,
      description: item.description,
      info: item.info,
      isCustom: item.isCustom,
      level,
      children: children.map(child => buildNodeRecursively(child, level + 1)),
      isExpanded: expandedNodes.has(item.id),
    };
    
    console.log(`📊 Built node ${item.name} (${item.id}) - Level: ${level}, Children: ${children.length}, Expanded: ${node.isExpanded}`);
    return node;
  };

  const buildNodeRecursively = (item: any, level: number): MindMapNode => {
    const itemsMap = [
      {},
      level2Items || {},
      level3Items || {},
      level4Items || {},
      level5Items || {},
      level6Items || {},
      level7Items || {},
      level8Items || {},
      level9Items || {},
      level10Items || {},
    ];

    const currentLevelItems = itemsMap[level] || {};
    const children = currentLevelItems[item.id] || [];

    return buildNode(item, level, () => children);
  };

  const result = level1Items.map(item => buildNodeRecursively(item, 1));
  console.log("🎯 Mindmap Transform Result:", {
    nodeCount: result.length,
    nodes: result.map(n => ({ id: n.id, name: n.name, expanded: n.isExpanded, childCount: n.children.length }))
  });
  
  return result;
};

export const calculateNodePositions = (
  nodes: MindMapNode[],
  containerWidth: number = 1200,
  containerHeight: number = 800
): MindMapNode[] => {
  console.log("📐 Calculating positions for container:", { containerWidth, containerHeight, nodeCount: nodes.length });
  
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

    console.log(`📍 Positioning node ${node.name} at (${x}, ${y})`);

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

  if (nodes.length === 0) {
    console.warn("⚠️ No nodes to position");
    return [];
  }

  // Position root node at center
  const rootNode = positionNode(nodes[0], centerX, centerY);
  console.log("✅ Positioned root node:", { x: rootNode.x, y: rootNode.y, expanded: rootNode.isExpanded });
  
  return [rootNode];
};
