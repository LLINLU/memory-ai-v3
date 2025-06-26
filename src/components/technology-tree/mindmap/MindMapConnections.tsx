import React from "react";
import { MindMapConnection } from "@/utils/mindMapDataTransform";

interface MindMapConnectionsProps {
  connections: MindMapConnection[];
  layoutDirection: 'horizontal' | 'vertical';
  selectedNodeId?: string;
}

export const MindMapConnections: React.FC<MindMapConnectionsProps> = ({
  connections,
  layoutDirection,
  selectedNodeId,
}) => {
  const createCurvedPath = (connection: MindMapConnection): string => {
    const { sourceX, sourceY, targetX, targetY } = connection;
    
    if (layoutDirection === 'horizontal') {
      // KEEP existing curved path logic unchanged for horizontal
      const midX = sourceX + (targetX - sourceX) / 2;
      
      // Create a smooth bezier curve similar to D3 tree layouts
      return `M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`;
    } else {
      // NEW vertical curve logic only
      const midY = sourceY + (targetY - sourceY) / 2;
      
      // Create vertical bezier curve
      return `M ${sourceX} ${sourceY} C ${sourceX} ${midY} ${targetX} ${midY} ${targetX} ${targetY}`;
    }
  };

  // 選択されたノードの全ての子孫を見つける関数
  const findAllDescendants = (nodeId: string, connections: MindMapConnection[]): Set<string> => {
    const descendants = new Set<string>();
    const queue = [nodeId];
    
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      
      // 現在のノードの直接の子を見つける
      connections.forEach(connection => {
        if (connection.sourceId === currentNode) {
          const childId = connection.targetId;
          if (!descendants.has(childId)) {
            descendants.add(childId);
            queue.push(childId); // 孫以降も探すためにキューに追加
          }
        }
      });
    }
    
    return descendants;
  };

  // 選択されたノードの全ての先祖を見つける関数
  const findAllAncestors = (nodeId: string, connections: MindMapConnection[]): Set<string> => {
    const ancestors = new Set<string>();
    const queue = [nodeId];
    
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      
      // 現在のノードの直接の親を見つける
      connections.forEach(connection => {
        if (connection.targetId === currentNode) {
          const parentId = connection.sourceId;
          if (!ancestors.has(parentId)) {
            ancestors.add(parentId);
            queue.push(parentId);
          }
        }
      });
    }
    
    return ancestors;
  };

  // 選択されたノードに関連する全てのエッジかどうかを判定する関数
  const isHighlightedEdge = (connection: MindMapConnection): boolean => {
    if (!selectedNodeId) return false;
    
    // 選択されたノードの全ての子孫と先祖を取得
    const descendants = findAllDescendants(selectedNodeId, connections);
    const ancestors = findAllAncestors(selectedNodeId, connections);
    
    return (
      // 選択されたノードから子孫へのエッジ
      (connection.sourceId === selectedNodeId && descendants.has(connection.targetId)) ||
      // 先祖から選択されたノードへのエッジ
      (ancestors.has(connection.sourceId) && (ancestors.has(connection.targetId) || connection.targetId === selectedNodeId)) ||
      // 選択されたノードの子孫間のエッジ
      (descendants.has(connection.sourceId) && descendants.has(connection.targetId))
    );
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
          stroke={isHighlightedEdge(connection) ? "#ef4444" : "#64748b"}
          strokeWidth={isHighlightedEdge(connection) ? "3" : "2"}
          fill="none"
          opacity={isHighlightedEdge(connection) ? "0.9" : "0.6"}
          className="transition-all duration-200"
        />
      ))}
    </svg>
  );
};
