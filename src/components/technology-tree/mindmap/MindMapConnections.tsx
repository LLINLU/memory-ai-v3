
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
    
    // Create a smooth bezier curve similar to D3 tree layouts
    return `M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`;
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
      {connections.map((connection) => (
        <path
          key={connection.id}
          d={createCurvedPath(connection)}
          stroke="#64748b"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          className="transition-all duration-200"
        />
      ))}
    </svg>
  );
};
