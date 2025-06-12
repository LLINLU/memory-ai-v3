
import React, { useMemo } from "react";
import { transformToMindMapData } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { MindMapControls } from "./MindMapControls";
import { usePanZoom } from "@/hooks/tree/usePanZoom";
import { Group } from "@visx/group";
import { Tree } from "@visx/hierarchy";

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
  const { root, nodes, connections } = useMemo(() => {
    console.log('MindMap: Processing data for mindmap view');
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

  // Container dimensions with margins like Airbnb example
  const margin = { top: 50, left: 50, right: 50, bottom: 50 };
  const containerWidth = 1200;
  const containerHeight = 800;
  const innerWidth = containerWidth - margin.left - margin.right;
  const innerHeight = containerHeight - margin.top - margin.bottom;

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

  console.log(`MindMap: Container dimensions - ${containerWidth}x${containerHeight}`);

  return (
    <div className="w-full h-full overflow-hidden bg-background relative">
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
        <svg
          width={containerWidth}
          height={containerHeight}
          style={{
            transform: getTransform(),
            transformOrigin: 'top left',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <Group top={margin.top} left={margin.left}>
            {/* Use visx Tree component pattern */}
            <Tree root={root} size={[innerHeight, innerWidth]}>
              {(tree) => (
                <Group>
                  {/* Render connections */}
                  <MindMapConnections connections={connections} />
                  
                  {/* Render nodes */}
                  {tree.descendants().map((node, i) => (
                    <MindMapNodeComponent
                      key={`node-${node.data.id}-${i}`}
                      node={node}
                      onClick={handleNodeClick}
                      onEdit={onEditNode}
                      onDelete={onDeleteNode}
                    />
                  ))}
                </Group>
              )}
            </Tree>
          </Group>
          
          {nodes.length === 0 && (
            <text x={containerWidth / 2} y={containerHeight / 2} textAnchor="middle" className="fill-muted-foreground">
              <tspan x={containerWidth / 2} dy="0" className="text-lg">No data available for mindmap view</tspan>
              <tspan x={containerWidth / 2} dy="1.5em" className="text-sm">Please ensure your tree has been generated</tspan>
            </text>
          )}
        </svg>
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
