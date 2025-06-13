
import React, { useMemo } from "react";
import { transformToMindMapData } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { MindMapControls } from "./MindMapControls";
import { usePanZoom } from "@/hooks/tree/usePanZoom";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  query?: string;
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
  query,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const { nodes, connections } = useMemo(() => {
    console.log('MindMap: Processing data for compact D3 tree layout with root node');
    console.log('User query for root:', query);
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
      selectedPath,
      query || "Research Query"
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
    query,
  ]);

  const handleNodeClick = (nodeId: string, level: number) => {
    console.log(`MindMap: Node clicked - Level ${level}, ID: ${nodeId}`);
    
    // Don't allow clicking on the root node (level 0)
    if (level === 0) {
      console.log('MindMap: Root node clicked, ignoring');
      return;
    }
    
    onNodeClick(`level${level}`, nodeId);
  };

  // Calculate container dimensions based on compact D3 layout with proper padding
  // Account for reduced horizontal spacing (400px nodeSize) and left margin (250px)
  const containerWidth = nodes.length > 0 ? Math.max(...nodes.map(n => n.x + 400), 1400) : 1400;
  const containerHeight = nodes.length > 0 ? Math.max(...nodes.map(n => n.y + 120), 600) : 600;

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

  console.log(`MindMap: Compact D3 layout - Container dimensions: ${containerWidth}x${containerHeight}, Nodes: ${nodes.length}`);

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div className="w-full h-full overflow-hidden bg-white relative">
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
                <p className="text-lg">No data available for mindmap view</p>
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
    </TooltipProvider>
  );
};
