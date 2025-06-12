
import React from "react";
import { LinkHorizontal } from "@visx/shape";
import { MindMapConnection } from "@/utils/mindMapDataTransform";

interface MindMapConnectionsProps {
  connections: MindMapConnection[];
}

export const MindMapConnections: React.FC<MindMapConnectionsProps> = ({
  connections,
}) => {
  return (
    <g>
      {connections.map((connection, i) => (
        <LinkHorizontal
          key={`link-${i}`}
          data={connection}
          stroke="#64748b"
          strokeWidth="2"
          fill="none"
          strokeOpacity={0.6}
        />
      ))}
    </g>
  );
};
