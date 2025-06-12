
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
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;
const LEVEL_SPACING = 300;
const NODE_SPACING = 100;
const MIN_GROUP_SPACING = 400; // Increased minimum spacing between parent groups
const CONNECTION_CLEARANCE = 50; // Additional buffer for connection line clearance

// Helper function to calculate the vertical space required for a parent-child group
const calculateGroupVerticalSpace = (childrenCount: number): number => {
  if (childrenCount === 0) return NODE_HEIGHT;
  if (childrenCount === 1) return NODE_HEIGHT;
  if (childrenCount === 2) return NODE_HEIGHT + 2 * (NODE_HEIGHT + NODE_SPACING);
  
  // For multiple children, calculate total span
  const totalChildrenHeight = childrenCount * NODE_HEIGHT;
  const totalSpacing = (childrenCount - 1) * NODE_SPACING;
  return totalChildrenHeight + totalSpacing + NODE_HEIGHT; // Include parent height
};

// Helper function to calculate dynamic spacing between groups
const calculateDynamicSpacing = (
  currentGroupSize: number, 
  nextGroupSize: number
): number => {
  const currentSpace = calculateGroupVerticalSpace(currentGroupSize);
  const nextSpace = calculateGroupVerticalSpace(nextGroupSize);
  
  // Use the larger of the two groups plus connection clearance
  const requiredSpace = Math.max(currentSpace, nextSpace) / 2 + CONNECTION_CLEARANCE;
  return Math.max(MIN_GROUP_SPACING, requiredSpace);
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

  // Helper function to create a connection
  const createConnection = (sourceNode: MindMapNode, targetNode: MindMapNode): MindMapConnection => {
    return {
      id: `${sourceNode.id}-${targetNode.id}`,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      sourceX: sourceNode.x + NODE_WIDTH,
      sourceY: sourceNode.y + NODE_HEIGHT / 2,
      targetX: targetNode.x,
      targetY: targetNode.y + NODE_HEIGHT / 2,
    };
  };

  // FIRST PASS: Create Level 1 nodes (no parents)
  let level1YPosition = 50;
  level1Items.forEach((item) => {
    const node: MindMapNode = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      level: 1,
      levelName: levelNames.level1 || "Level 1",
      x: 50,
      y: level1YPosition,
      isSelected: selectedPath.level1 === item.id,
      isCustom: item.isCustom || false,
    };
    nodes.push(node);
    level1YPosition += NODE_HEIGHT + NODE_SPACING;
  });

  // Helper function to process children with enhanced spacing calculations
  const processChildrenLevel = (
    childrenData: Record<string, TreeNode[]>,
    level: number,
    levelName: string
  ) => {
    const parentGroups = Object.entries(childrenData).filter(([_, children]) => children && children.length > 0);
    let currentGroupYOffset = 50; // Start position for first group
    
    parentGroups.forEach(([parentId, children], groupIndex) => {
      const parentNode = nodes.find(n => n.id === parentId);
      if (!parentNode || !children || children.length === 0) return;

      const x = (level - 1) * LEVEL_SPACING + 50;
      
      // Calculate spacing for current and next group
      const currentGroupSize = children.length;
      const nextGroupSize = groupIndex < parentGroups.length - 1 
        ? parentGroups[groupIndex + 1][1].length 
        : 0;
      
      if (children.length === 1) {
        // Single child: place at same level as parent, but adjust parent position
        const child: MindMapNode = {
          id: children[0].id,
          name: children[0].name,
          description: children[0].description || "",
          level,
          levelName,
          x,
          y: currentGroupYOffset,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[0].id,
          isCustom: children[0].isCustom || false,
        };
        nodes.push(child);
        
        // Update parent position to align with child
        parentNode.y = currentGroupYOffset;
        connections.push(createConnection(parentNode, child));
        
        // Calculate spacing to next group
        if (nextGroupSize > 0) {
          currentGroupYOffset += calculateDynamicSpacing(currentGroupSize, nextGroupSize);
        }

      } else if (children.length === 2) {
        // Two children: one above, one below parent
        const spacing = NODE_HEIGHT + NODE_SPACING;
        
        // Position parent at the center of the group
        const groupCenterY = currentGroupYOffset + spacing;
        parentNode.y = groupCenterY;
        
        // First child above parent
        const firstChild: MindMapNode = {
          id: children[0].id,
          name: children[0].name,
          description: children[0].description || "",
          level,
          levelName,
          x,
          y: currentGroupYOffset,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[0].id,
          isCustom: children[0].isCustom || false,
        };
        
        // Second child below parent
        const secondChild: MindMapNode = {
          id: children[1].id,
          name: children[1].name,
          description: children[1].description || "",
          level,
          levelName,
          x,
          y: currentGroupYOffset + 2 * spacing,
          parentId,
          isSelected: selectedPath[`level${level}`] === children[1].id,
          isCustom: children[1].isCustom || false,
        };

        nodes.push(firstChild, secondChild);
        connections.push(createConnection(parentNode, firstChild));
        connections.push(createConnection(parentNode, secondChild));
        
        // Update offset for next group with enhanced spacing
        if (nextGroupSize > 0) {
          currentGroupYOffset += 2 * spacing + calculateDynamicSpacing(currentGroupSize, nextGroupSize);
        }

      } else {
        // Multiple children: distribute around parent with enhanced spacing
        const spacing = NODE_HEIGHT + NODE_SPACING;
        const totalHeight = (children.length - 1) * spacing;
        
        // Position parent at the center of all children
        const groupCenterY = currentGroupYOffset + totalHeight / 2;
        parentNode.y = groupCenterY;
        
        // Position children distributed around the group center
        const startY = currentGroupYOffset;

        children.forEach((childItem, index) => {
          const child: MindMapNode = {
            id: childItem.id,
            name: childItem.name,
            description: childItem.description || "",
            level,
            levelName,
            x,
            y: startY + (index * spacing),
            parentId,
            isSelected: selectedPath[`level${level}`] === childItem.id,
            isCustom: childItem.isCustom || false,
          };
          nodes.push(child);
          connections.push(createConnection(parentNode, child));
        });
        
        // Update offset for next group with enhanced spacing
        if (nextGroupSize > 0) {
          currentGroupYOffset += totalHeight + calculateDynamicSpacing(currentGroupSize, nextGroupSize);
        }
      }
    });
  };

  // Process all child levels with enhanced spacing
  processChildrenLevel(level2Items, 2, levelNames.level2 || "Level 2");
  processChildrenLevel(level3Items, 3, levelNames.level3 || "Level 3");
  processChildrenLevel(level4Items, 4, levelNames.level4 || "Level 4");
  processChildrenLevel(level5Items, 5, levelNames.level5 || "Level 5");
  processChildrenLevel(level6Items, 6, levelNames.level6 || "Level 6");
  processChildrenLevel(level7Items, 7, levelNames.level7 || "Level 7");
  processChildrenLevel(level8Items, 8, levelNames.level8 || "Level 8");
  processChildrenLevel(level9Items, 9, levelNames.level9 || "Level 9");
  processChildrenLevel(level10Items, 10, levelNames.level10 || "Level 10");

  console.log(`Mindmap: Generated ${nodes.length} nodes and ${connections.length} connections`);
  console.log('Level breakdown:', {
    level1: nodes.filter(n => n.level === 1).length,
    level2: nodes.filter(n => n.level === 2).length,
    level3: nodes.filter(n => n.level === 3).length,
    level4: nodes.filter(n => n.level === 4).length,
  });

  return { nodes, connections };
};
