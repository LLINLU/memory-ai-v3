
import React from "react";
import { LinkHorizontal } from "@visx/shape";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { MindMapNode } from "@/utils/mindMapDataTransform";

interface MindMapConnectionsProps {
  connections: Array<{
    source: HierarchyPointNode<MindMapNode>;
    target: HierarchyPointNode<MindMapNode>;
  }>;
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
          stroke="hsl(var(--border))"
          strokeWidth="2"
          fill="none"
          strokeOpacity={0.6}
          markerEnd="url(#arrow)"
        />
      ))}
      
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="3"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="m0,0 l0,6 l9,3 l-9,3 l0,6" fill="hsl(var(--border))" />
        </marker>
      </defs>
    </g>
  );
};
