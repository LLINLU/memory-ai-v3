
import { TreeNode } from "@/types/tree";

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
}

export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  controlPoint1X: number;
  controlPoint1Y: number;
  controlPoint2X: number;
  controlPoint2Y: number;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;
const BASE_RADIUS = 250;
const LEVEL_MULTIPLIER = 1.4;
const MIN_ANGLE_SPREAD = Math.PI / 6; // 30 degrees minimum between branches

// Calculate organic position using polar coordinates
const calculateOrganicPosition = (
  parentX: number,
  parentY: number,
  level: number,
  childIndex: number,
  totalChildren: number,
  parentAngle = 0
): { x: number; y: number; angle: number } => {
  const radius = BASE_RADIUS * Math.pow(LEVEL_MULTIPLIER, level - 2);
  
  // Calculate angle spread based on number of children
  const maxSpread = Math.min(Math.PI * 1.2, totalChildren * MIN_ANGLE_SPREAD * 1.5);
  const startAngle = parentAngle - maxSpread / 2;
  
  // Use golden ratio for natural distribution
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  let angle;
  
  if (totalChildren === 1) {
    angle = parentAngle;
  } else {
    // Distribute children using fibonacci-based spacing for natural look
    const normalizedIndex = childIndex / (totalChildren - 1);
    const fibSpacing = Math.pow(normalizedIndex, 1 / goldenRatio);
    angle = startAngle + maxSpread * fibSpacing;
  }
  
  // Add some organic variation
  const variation = (Math.sin(childIndex * 2.3) * 0.1) + (Math.cos(childIndex * 1.7) * 0.05);
  angle += variation;
  
  // Calculate position with some organic distance variation
  const distanceVariation = 0.8 + (Math.sin(childIndex * 1.1) * 0.2);
  const adjustedRadius = radius * distanceVariation;
  
  const x = parentX + Math.cos(angle) * adjustedRadius;
  const y = parentY + Math.sin(angle) * adjustedRadius;
  
  return { x, y, angle };
};

// Create organic bezier curve control points
const createOrganicControlPoints = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Create flowing curves that bend naturally
  const curvature = Math.min(distance * 0.4, 150);
  
  // Calculate perpendicular for natural curve
  const perpX = -dy / distance;
  const perpY = dx / distance;
  
  // Add organic variation to the curve
  const variation1 = Math.sin(sourceX * 0.01) * 20;
  const variation2 = Math.cos(targetY * 0.01) * 15;
  
  const cp1X = sourceX + dx * 0.3 + perpX * (curvature + variation1);
  const cp1Y = sourceY + dy * 0.3 + perpY * (curvature + variation1);
  
  const cp2X = sourceX + dx * 0.7 + perpX * (curvature * 0.5 + variation2);
  const cp2Y = sourceY + dy * 0.7 + perpY * (curvature * 0.5 + variation2);
  
  return {
    controlPoint1X: cp1X,
    controlPoint1Y: cp1Y,
    controlPoint2X: cp2X,
    controlPoint2Y: cp2Y,
  };
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
  
  // Track node positions and angles for organic layout
  const nodePositions: Record<string, { x: number; y: number; angle: number }> = {};
  
  // Helper function to create a node with organic positioning
  const createNode = (
    item: TreeNode,
    level: number,
    levelName: string,
    parentId?: string
  ): MindMapNode => {
    let x: number, y: number, angle: number;
    
    if (level === 1) {
      // Position Level 1 nodes as central roots on the left side
      const rootY = 400 + (nodes.filter(n => n.level === 1).length - 0.5) * 300;
      x = 150;
      y = rootY;
      angle = 0; // Start angle for root nodes
    } else {
      // Calculate organic position relative to parent
      const parent = nodes.find(n => n.id === parentId);
      if (!parent) {
        x = 150;
        y = 400;
        angle = 0;
      } else {
        const parentPos = nodePositions[parent.id];
        const siblings = level === 2 ? level2Items[parentId!] :
                        level === 3 ? level3Items[parentId!] :
                        level === 4 ? level4Items[parentId!] :
                        level === 5 ? level5Items[parentId!] :
                        level === 6 ? level6Items[parentId!] :
                        level === 7 ? level7Items[parentId!] :
                        level === 8 ? level8Items[parentId!] :
                        level === 9 ? level9Items[parentId!] :
                        level10Items[parentId!] || [];
        
        const childIndex = siblings.findIndex(s => s.id === item.id);
        const totalChildren = siblings.length;
        
        const position = calculateOrganicPosition(
          parent.x + NODE_WIDTH / 2,
          parent.y + NODE_HEIGHT / 2,
          level,
          childIndex,
          totalChildren,
          parentPos.angle
        );
        
        x = position.x - NODE_WIDTH / 2;
        y = position.y - NODE_HEIGHT / 2;
        angle = position.angle;
      }
    }
    
    // Store position and angle for children calculations
    nodePositions[item.id] = { x: x + NODE_WIDTH / 2, y: y + NODE_HEIGHT / 2, angle };
    
    return {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level,
      levelName,
      x,
      y,
      parentId,
      isSelected: selectedPath[`level${level}`] === item.id,
      isCustom: item.isCustom || false,
    };
  };

  // Helper function to create organic connections
  const createConnection = (sourceNode: MindMapNode, targetNode: MindMapNode): MindMapConnection => {
    const sourceX = sourceNode.x + NODE_WIDTH;
    const sourceY = sourceNode.y + NODE_HEIGHT / 2;
    const targetX = targetNode.x;
    const targetY = targetNode.y + NODE_HEIGHT / 2;
    
    const controlPoints = createOrganicControlPoints(sourceX, sourceY, targetX, targetY);
    
    return {
      id: `${sourceNode.id}-${targetNode.id}`,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      ...controlPoints,
    };
  };

  // Process Level 1 nodes (roots)
  level1Items.forEach((item) => {
    const node = createNode(item, 1, levelNames.level1 || "Level 1");
    nodes.push(node);
  });

  // Process all other levels using the same organic pattern
  const levelData = [
    { items: level2Items, level: 2, name: levelNames.level2 || "Level 2" },
    { items: level3Items, level: 3, name: levelNames.level3 || "Level 3" },
    { items: level4Items, level: 4, name: levelNames.level4 || "Level 4" },
    { items: level5Items, level: 5, name: levelNames.level5 || "Level 5" },
    { items: level6Items, level: 6, name: levelNames.level6 || "Level 6" },
    { items: level7Items, level: 7, name: levelNames.level7 || "Level 7" },
    { items: level8Items, level: 8, name: levelNames.level8 || "Level 8" },
    { items: level9Items, level: 9, name: levelNames.level9 || "Level 9" },
    { items: level10Items, level: 10, name: levelNames.level10 || "Level 10" },
  ];

  levelData.forEach(({ items, level, name }) => {
    Object.entries(items).forEach(([parentId, nodeItems]) => {
      const parentNode = nodes.find(n => n.id === parentId);
      if (parentNode && nodeItems) {
        nodeItems.forEach((item) => {
          const node = createNode(item, level, name, parentId);
          nodes.push(node);
          connections.push(createConnection(parentNode, node));
        });
      }
    });
  });

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections with organic layout`);
  
  return { nodes, connections };
};
