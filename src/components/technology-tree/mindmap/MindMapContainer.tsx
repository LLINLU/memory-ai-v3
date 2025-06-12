
import React, { useMemo } from "react";
import { transformToMindMapData } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { MindMapControls } from "./MindMapControls";
import { usePanZoom } from "@/hooks/tree/usePanZoom";

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
    console.log('MindMap: Processing data for organic mindmap view');
    console.log('Level 1 items:', level1Items?.length || 0);
    console.log('Level 2 items:', Object.keys(level2Items || {}).length);
    console.log('Level 3 items:', Object.keys(level3Items || {}).length);
    
    return transformToMindMapData(
      level1Items || [],
      level2Items || {},
      level3Items || {},
      level4Items || {},
      level5Items || {},
      level6Items || {},
      level7Items || {},
      level8Items || {},
      level9Items || {},
      level10Items || {},
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
    console.log(`MindMap: Node clicked - Level ${level}, ID: ${nodeId}`);
    onNodeClick(`level${level}`, nodeId);
  };

  // Calculate container dimensions for organic layout (larger area needed)
  const containerWidth = Math.max(...nodes.map(n => n.x + 300), 1600);
  const containerHeight = Math.max(...nodes.map(n => n.y + 150), 1200);

  const {
    zoom,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    zoomIn,
    zoomOut,
    resetView,
    getTransform,
  } = usePanZoom(containerWidth, containerHeight);

  console.log(`MindMap: Organic container dimensions - ${containerWidth}x${containerHeight}`);

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50 relative">
      <div
        className="w-full h-full relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
      >
        <div
          className="relative origin-top-left transition-transform duration-200 ease-out"
          style={{
            width: containerWidth,
            height: containerHeight,
            minWidth: "100%",
            minHeight: "100%",
            transform: getTransform(),
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
          
          {nodes.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
              <p className="text-lg">No data available for organic mindmap view</p>
              <p className="text-sm mt-2">Please ensure your tree has been generated</p>
            </div>
          )}
        </div>
      </div>

      <MindMapControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
      />
    </div>
  );
};
