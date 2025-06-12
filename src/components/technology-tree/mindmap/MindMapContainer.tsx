
import React, { useMemo } from "react";
import { transformToMindMapData } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";

interface MindMapContainerProps {
  selectedPath: any;
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  level5Items: Record<string, any[]>;
  level6Items: Record<string, any[]>;
  level7Items: Record<string, any[]>;
  level8Items: Record<string, any[]>;
  level9Items: Record<string, any[]>;
  level10Items: Record<string, any[]>;
  levelNames: Record<string, string>;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

export const MindMapContainer: React.FC<MindMapContainerProps> = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  level4Items,
  level5Items,
  level6Items,
  level7Items,
  level8Items,
  level9Items,
  level10Items,
  levelNames,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const { nodes, connections } = useMemo(() => {
    return transformToMindMapData(
      level1Items,
      level2Items,
      level3Items,
      level4Items,
      level5Items,
      level6Items,
      level7Items,
      level8Items,
      level9Items,
      level10Items,
      levelNames,
      selectedPath
    );
  }, [
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    levelNames,
    selectedPath,
  ]);

  const handleNodeClick = (nodeId: string, level: number) => {
    onNodeClick(`level${level}`, nodeId);
  };

  // Calculate container dimensions based on nodes
  const containerWidth = Math.max(...nodes.map(n => n.x + 220), 800);
  const containerHeight = Math.max(...nodes.map(n => n.y + 100), 600);

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 relative">
      <div
        className="relative"
        style={{
          width: containerWidth,
          height: containerHeight,
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        <MindMapConnections connections={connections} />
        
        {nodes.map((node) => (
          <MindMapNodeComponent
            key={node.id}
            node={node}
            onClick={handleNodeClick}
            onEdit={onEditNode}
            onDelete={onDeleteNode}
          />
        ))}
      </div>
    </div>
  );
};
