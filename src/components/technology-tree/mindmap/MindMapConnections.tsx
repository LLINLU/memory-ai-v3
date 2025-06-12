
import React from "react";
import { MindMapConnection } from "@/utils/mindMapDataTransform";

interface MindMapConnectionsProps {
  connections: MindMapConnection[];
}

export const MindMapConnections: React.FC<MindMapConnectionsProps> = ({
  connections,
}) => {
  const createOrganicPath = (connection: MindMapConnection): string => {
    const { sourceX, sourceY, targetX, targetY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = connection;
    
    // Create smooth cubic bezier curve for organic flow
    return `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
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
        {/* Gradient for organic tree-like appearance */}
        <linearGradient id="organicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Drop shadow for depth */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {connections.map((connection, index) => {
        // Calculate line thickness based on tree depth (thicker at root, thinner at leaves)
        const sourceLevel = connections.filter(c => c.targetId === connection.sourceId).length;
        const thickness = Math.max(1.5, 4 - sourceLevel * 0.3);
        
        return (
          <path
            key={connection.id}
            d={createOrganicPath(connection)}
            stroke="url(#organicGradient)"
            strokeWidth={thickness}
            fill="none"
            opacity="0.7"
            filter="url(#dropShadow)"
            style={{
              // Smooth animation for organic feel
              transition: "all 0.3s ease-out",
            }}
          />
        );
      })}
    </svg>
  );
};
