
import React from "react";
import { MindMapConnection } from "@/utils/mindMapDataTransform";

interface MindMapConnectionsProps {
  connections: MindMapConnection[];
}

export const MindMapConnections: React.FC<MindMapConnectionsProps> = ({
  connections,
}) => {
  const createCurvedPath = (connection: MindMapConnection): string => {
    const { sourceX, sourceY, targetX, targetY } = connection;
    const midX = sourceX + (targetX - sourceX) / 2;
    
    return `M ${sourceX} ${sourceY} Q ${midX} ${sourceY} ${targetX} ${targetY}`;
  };

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{ 
        width: "100%", 
        height: "100%",
        overflow: "visible"
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#64748b"
          />
        </marker>
      </defs>
      
      {connections.map((connection) => (
        <path
          key={connection.id}
          d={createCurvedPath(connection)}
          stroke="#64748b"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          opacity="0.6"
        />
      ))}
    </svg>
  );
};
