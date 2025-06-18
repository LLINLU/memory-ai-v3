
import { Connection, MindMapNode, MindMapConnection } from "@/types/mindmap";

export const transformToMindMapData = (
  level1Items: any[],
  level2Items: Record<string, any[]>,
  level3Items: Record<string, any[]>,
  level4Items: Record<string, any[]>,
  level5Items: Record<string, any[]>,
  level6Items: Record<string, any[]>,
  level7Items: Record<string, any[]>,
  level8Items: Record<string, any[]>,
  level9Items: Record<string, any[]>,
  level10Items: Record<string, any[]>,
  levelNames: Record<string, string>,
  selectedPath: any,
  queryText: string,
  layoutDirection: 'horizontal' | 'vertical' = 'horizontal',
  isNodeVisuallySelected?: (level: string, nodeId: string) => boolean
): { nodes: MindMapNode[]; connections: MindMapConnection[] } => {
  const nodes: MindMapNode[] = [];
  const connections: Connection[] = [];

  if (
    !level1Items ||
    level1Items.length === 0
  ) {
    return { nodes: [], connections: [] };
  }

  const horizontalLayout = layoutDirection === 'horizontal';
  const levelSpacingX = horizontalLayout ? 300 : 0;
  const levelSpacingY = horizontalLayout ? 0 : 200;
  const nodeSpacingX = horizontalLayout ? 200 : 120;
  const nodeSpacingY = horizontalLayout ? 120 : 80;

  // Root node (query)
  nodes.push({
    id: 'root',
    name: queryText,
    x: 0,
    y: 0,
    level: 0,
    isSelected: false, // Root is never selected
    description: '',
    children_count: level1Items.length,
  });

  // Process each level with the new visual selection logic
  const processLevel = (
    items: any[],
    level: number,
    parentX: number,
    parentY: number,
    levelName: string
  ) => {
    const itemCount = items.length;
    const startY = parentY - ((itemCount - 1) * nodeSpacingY) / 2;

    items.forEach((item, index) => {
      const nodeX = parentX + levelSpacingX;
      const nodeY = horizontalLayout ? startY + index * nodeSpacingY : parentY + levelSpacingY;

      // Use shared visual selection instead of path-based selection
      const isSelected = isNodeVisuallySelected ? isNodeVisuallySelected(`level${level}`, item.id) : false;

      nodes.push({
        id: item.id,
        name: item.name,
        x: nodeX,
        y: nodeY,
        level,
        isSelected, // Use visual selection
        description: item.description || item.info || '',
        children_count: item.children_count || 0,
      });

      connections.push({
        source: level === 1 ? 'root' : selectedPath[`level${level - 1}`],
        target: item.id,
      });
    });
  };

  // Process all levels
  processLevel(level1Items, 1, 0, 0, levelNames.level1);

  const processNextLevel = (
    parentItems: any[],
    currentLevel: number,
    nextLevelItems: Record<string, any[]>
  ) => {
    parentItems.forEach((parentItem) => {
      const items = nextLevelItems[parentItem.id] || [];
      processLevel(
        items,
        currentLevel,
        nodes.find((node) => node.id === parentItem.id)!.x,
        nodes.find((node) => node.id === parentItem.id)!.y,
        levelNames[`level${currentLevel}`]
      );
    });
  };

  processNextLevel(level1Items, 2, level2Items);
  processNextLevel(level2Items ? Object.values(level2Items).flat() : [], 3, level3Items);
  processNextLevel(level3Items ? Object.values(level3Items).flat() : [], 4, level4Items);
  processNextLevel(level4Items ? Object.values(level4Items).flat() : [], 5, level5Items);
  processNextLevel(level5Items ? Object.values(level5Items).flat() : [], 6, level6Items);
  processNextLevel(level6Items ? Object.values(level6Items).flat() : [], 7, level7Items);
  processNextLevel(level7Items ? Object.values(level7Items).flat() : [], 8, level8Items);
  processNextLevel(level8Items ? Object.values(level8Items).flat() : [], 9, level9Items);
  processNextLevel(level9Items ? Object.values(level9Items).flat() : [], 10, level10Items);

  // Transform basic connections to MindMapConnections with coordinates
  const mindMapConnections: MindMapConnection[] = connections.map((conn, index) => {
    const sourceNode = nodes.find(n => n.id === conn.source);
    const targetNode = nodes.find(n => n.id === conn.target);
    
    return {
      id: `conn-${index}`,
      source: conn.source,
      target: conn.target,
      sourceX: sourceNode ? sourceNode.x + (horizontalLayout ? 280 : 60) : 0,
      sourceY: sourceNode ? sourceNode.y + (horizontalLayout ? 30 : 50) : 0,
      targetX: targetNode ? targetNode.x : 0,
      targetY: targetNode ? targetNode.y + (horizontalLayout ? 30 : 50) : 0,
    };
  });

  return { nodes, connections: mindMapConnections };
};
