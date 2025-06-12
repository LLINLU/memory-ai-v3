
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
    // Use design system colors instead of hardcoded ones
    const colors = [
      "hsl(var(--primary))", // Root
      "hsl(var(--secondary))", // Level 1
      "hsl(var(--accent))", // Level 2
      "hsl(var(--muted))", // Level 3
      "hsl(var(--destructive))", // Level 4
      "hsl(var(--primary) / 0.8)", // Level 5+
    ];
    return colors[Math.min(level, colors.length - 1)];
  };

  const getNodeSize = (level: number, hasChildren: boolean) => {
    if (level === 0) return { width: 80, height: 80, rx: 40 }; // Root - circle
    if (hasChildren) return { width: 120, height: 40, rx: 8 }; // Parent nodes
    return { width: 100, height: 32, rx: 16 }; // Leaf nodes
  };

  const handleClick = () => {
    if (node.data.level > 0) { // Don't handle clicks on virtual root
      onClick(node.data.id, node.data.level);
    }
  };

  const { width, height, rx } = getNodeSize(node.data.level, !!node.children?.length);
  const centerX = -width / 2;
  const centerY = -height / 2;
  const fillColor = getLevelColor(node.data.level);
  const strokeColor = node.data.isSelected ? "hsl(var(--ring))" : fillColor;
  const strokeWidth = node.data.isSelected ? 3 : 1;
  const textColor = node.data.level === 0 ? "hsl(var(--primary-foreground))" : "hsl(var(--primary-foreground))";

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        rx={rx}
        onClick={handleClick}
        style={{ cursor: node.data.level > 0 ? 'pointer' : 'default' }}
        className="transition-all duration-200 hover:opacity-80"
      />
      
      <text
        dy=".33em"
        fontSize={node.data.level === 0 ? 14 : 12}
        fontFamily="inherit"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={textColor}
        fontWeight={node.data.level === 0 ? "600" : "500"}
      >
        {node.data.name.length > 15 ? `${node.data.name.slice(0, 15)}...` : node.data.name}
      </text>
      
      {node.data.description && node.data.level > 0 && height > 32 && (
        <text
          dy="1.8em"
          fontSize={10}
          fontFamily="inherit"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
          fill={textColor}
          opacity={0.8}
        >
          {node.data.description.length > 20 ? `${node.data.description.slice(0, 20)}...` : node.data.description}
        </text>
      )}
    </Group>
  );
};
