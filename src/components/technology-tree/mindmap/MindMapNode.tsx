
import React from "react";
import { Group } from "@visx/group";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { MindMapNode } from "@/utils/mindMapDataTransform";

interface MindMapNodeProps {
  node: HierarchyPointNode<MindMapNode>;
  onClick: (nodeId: string, level: number) => void;
  onEdit?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDelete?: (level: string, nodeId: string) => void;
}

export const MindMapNodeComponent: React.FC<MindMapNodeProps> = ({
  node,
  onClick,
  onEdit,
  onDelete,
}) => {
  const getLevelColor = (level: number) => {
    const colors = [
      "#fd9b93", // Level 0 (root) - peach
      "#03c0dc", // Level 1 - blue
      "#26deb0", // Level 2 - green
      "#fe6e9e", // Level 3 - pink
      "#71248e", // Level 4 - plum
      "#374469", // Level 5 - light purple
      "#fd9b93", // Level 6 - peach (repeat)
      "#03c0dc", // Level 7 - blue (repeat)
      "#26deb0", // Level 8 - green (repeat)
      "#fe6e9e", // Level 9 - pink (repeat)
    ];
    return colors[level % colors.length];
  };

  const getNodeDimensions = (level: number) => {
    if (level === 0) return { width: 60, height: 60, isCircle: true }; // Root node
    if (node.children && node.children.length > 0) return { width: 120, height: 40, isCircle: false }; // Parent nodes
    return { width: 100, height: 30, isCircle: false }; // Leaf nodes
  };

  const handleClick = () => {
    if (node.data.level > 0) { // Don't handle clicks on virtual root
      onClick(node.data.id, node.data.level);
    }
  };

  const { width, height, isCircle } = getNodeDimensions(node.data.level);
  const centerX = -width / 2;
  const centerY = -height / 2;
  const fillColor = getLevelColor(node.data.level);
  const strokeColor = node.data.isSelected ? "#2563eb" : fillColor;
  const strokeWidth = node.data.isSelected ? 3 : 1;

  return (
    <Group top={node.x} left={node.y}>
      {isCircle ? (
        <circle
          r={width / 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <rect
          height={height}
          width={width}
          y={centerY}
          x={centerX}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          rx={node.children ? 5 : 15} // More rounded for leaf nodes
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      )}
      
      <text
        dy=".33em"
        fontSize={node.data.level === 0 ? 12 : 10}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={node.data.level === 0 ? "#71248e" : "#ffffff"}
        fontWeight={node.data.level === 0 ? "bold" : "normal"}
      >
        {node.data.name.length > 12 ? `${node.data.name.slice(0, 12)}...` : node.data.name}
      </text>
      
      {node.data.description && node.data.level > 0 && (
        <text
          dy="1.5em"
          fontSize={8}
          fontFamily="Arial"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
          fill="#ffffff"
          opacity={0.8}
        >
          {node.data.description.length > 15 ? `${node.data.description.slice(0, 15)}...` : node.data.description}
        </text>
      )}
    </Group>
  );
};
