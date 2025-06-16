
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
    
    // Determine if this is a horizontal or vertical connection based on the positions
    const isHorizontal = Math.abs(sourceX - targetX) > Math.abs(sourceY - targetY);
    
    if (isHorizontal) {
      // Horizontal layout: curve horizontally
      const midX = sourceX + (targetX - sourceX) / 2;
      return `M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`;
    } else {
      // Vertical layout: curve vertically
      const midY = sourceY + (targetY - sourceY) / 2;
      return `M ${sourceX} ${sourceY} C ${sourceX} ${midY} ${targetX} ${midY} ${targetX} ${targetY}`;
    }
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
