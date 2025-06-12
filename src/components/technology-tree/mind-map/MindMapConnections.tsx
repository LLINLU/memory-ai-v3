
import React from "react";
import { MindMapNode } from "@/hooks/tree/useMindMapState";

interface MindMapConnectionsProps {
  nodes: MindMapNode[];
}

export const MindMapConnections: React.FC<MindMapConnectionsProps> = ({ nodes }) => {
  const renderConnections = (node: MindMapNode): JSX.Element[] => {
    const connections: JSX.Element[] = [];

    if (node.isExpanded && node.children.length > 0) {
      node.children.forEach((child) => {
        if (node.x !== undefined && node.y !== undefined && child.x !== undefined && child.y !== undefined) {
          const connectionId = `connection-${node.id}-${child.id}`;
          
          connections.push(
            <line
              key={connectionId}
              x1={node.x}
              y1={node.y}
              x2={child.x}
              y2={child.y}
              stroke="#94a3b8"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          );
        }

        // Recursively render connections for child nodes
        connections.push(...renderConnections(child));
      });
    }

    return connections;
  };

  const allConnections = nodes.flatMap(renderConnections);

  if (allConnections.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {allConnections}
    </svg>
  );
};
