
import React, { useMemo, useState, useEffect } from "react";
import { transformToMindMapData } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { MindMapControls } from "./MindMapControls";
import { MindMapLegend } from "./MindMapLegend";
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
  treeMode?: string; // Add treeMode prop
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
  treeMode, // Add treeMode parameter
}) => {
  // Add layout state - default to horizontal to preserve current behavior
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const { nodes, connections } = useMemo(() => {
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
      query || "Research Query",
      layoutDirection  // Pass layout direction to transform function
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
    layoutDirection,  // Add to dependency array
  ]);

  const handleNodeClick = (nodeId: string, level: number) => {
    // Don't allow clicking on the root node (level 0)
    if (level === 0) {
      console.log('MindMap: Root node clicked, ignoring');
      return;
    }
    
    onNodeClick(`level${level}`, nodeId);
  };

  const handleAiAssist = (nodeId: string, level: number) => {
    console.log('MindMap: AI Assist requested for node:', nodeId, 'level:', level);
    // Placeholder for AI assistance functionality
  };

  const handleAddNode = (nodeId: string, level: number) => {
    console.log('MindMap: Add Node requested for parent:', nodeId, 'level:', level);
    // Placeholder for add node functionality
  };

  // Calculate container dimensions based on layout direction and node dimensions
  const getNodeWidth = () => layoutDirection === 'horizontal' ? 280 : 120;
  const getNodeHeight = () => layoutDirection === 'horizontal' ? 60 : 100;
  
  const containerWidth = nodes.length > 0 ? Math.max(...nodes.map(n => n.x + getNodeWidth() + 100), 1400) : 1400;
  const containerHeight = nodes.length > 0 ? Math.max(...nodes.map(n => n.y + getNodeHeight() + 100), 600) : 600;

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

  // Reset view when new tree data is loaded (new search/regeneration)
  useEffect(() => {
    // Only reset if we have actual tree data
    if (level1Items && level1Items.length > 0) {
      // Add a small delay to ensure the mindmap data has been fully processed
      const timeoutId = setTimeout(() => {
        resetView();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [query, level1Items?.length, resetView]); // Reset when query changes or when level1Items count changes

  const toggleLayout = () => {
    setLayoutDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    // Automatically center the view after layout change
    setTimeout(() => {
      resetView();
    }, 100); // Small delay to ensure layout change has completed
  };

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
            <MindMapConnections connections={connections} layoutDirection={layoutDirection} />
            
            {nodes.map((node) => (
              <MindMapNodeComponent
                key={node.id}
                node={node}
                layoutDirection={layoutDirection}
                onClick={handleNodeClick}
                onEdit={onEditNode}
                onDelete={onDeleteNode}
                onAiAssist={handleAiAssist}
                onAddNode={handleAddNode}
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

        {/* Move legend outside the transformed container so it stays fixed in viewport */}
        <MindMapLegend treeMode={treeMode} />

        <MindMapControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetView={resetView}
          layoutDirection={layoutDirection}
          onToggleLayout={toggleLayout}
        />
      </div>
    </TooltipProvider>
  );
};
