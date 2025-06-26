import React, { useMemo, useState, useEffect, useRef } from "react";
import { transformToMindMapData, MindMapNode, MindMapConnection } from "@/utils/mindMapDataTransform";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { MindMapControls } from "./MindMapControls";
import { MindMapLegend } from "./MindMapLegend";
import { usePanZoom } from "@/hooks/tree/usePanZoom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TreeNode } from "@/types/tree";

//仮で現在の型に合わせる（後で修正）
interface SelectedPath {
  level1?: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level5?: string;
  level6?: string;
  level7?: string;
  level8?: string;
  level9?: string;
  level10?: string;
}

interface MindMapContainerProps {
  selectedPath: SelectedPath;
  level1Items: TreeNode[];
  level2Items: Record<string, TreeNode[]>;
  level3Items: Record<string, TreeNode[]>;
  level4Items: Record<string, TreeNode[]>;
  level5Items: Record<string, TreeNode[]>;
  level6Items: Record<string, TreeNode[]>;
  level7Items: Record<string, TreeNode[]>;
  level8Items: Record<string, TreeNode[]>;
  level9Items: Record<string, TreeNode[]>;
  level10Items: Record<string, TreeNode[]>;
  levelNames: Record<string, string>;
  query?: string;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  treeMode?: string;
  justSwitchedView?: boolean;
  onViewSwitchHandled?: () => void;
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
  treeMode,
  justSwitchedView,
  onViewSwitchHandled,
}) => {
  const [layoutDirection, setLayoutDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [selectedNodeForHighlight, setSelectedNodeForHighlight] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [lastQuery, setLastQuery] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

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
      layoutDirection,
      expandedNodes
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
    layoutDirection,
    expandedNodes,
  ]);

  const handleNodeClick = (nodeId: string, level: number) => {
    if (level === 0) {
      console.log('MindMap: Root node clicked, ignoring');
      return;
    }
    
    setSelectedNodeForHighlight(nodeId);
    onNodeClick(`level${level}`, nodeId);
  };

  const handleAiAssist = (nodeId: string, level: number) => {
    console.log('MindMap: AI Assist requested for node:', nodeId, 'level:', level);
  };

  const handleAddNode = (nodeId: string, level: number) => {
    console.log('MindMap: Add Node requested for parent:', nodeId, 'level:', level);
  };

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
    centerOnNode,
    getTransform,
  } = usePanZoom(containerWidth, containerHeight);

  // Replace the conflicting wheel handlers with comprehensive debug version
  const handleContainerWheel = (e: React.WheelEvent) => {
    
    // Try all possible ways to stop event propagation
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    console.log('🔴 Event propagation stopped, calling handleWheel');
    
    // Call the pan/zoom wheel handler
    handleWheel(e);
  };

  const handleInnerWheel = (e: React.WheelEvent) => {
    console.log('🔵 Inner container wheel triggered');
    console.log('Target:', (e.target as HTMLElement)?.className);
    console.log('Event timestamp:', Date.now());
    e.stopPropagation();
    e.preventDefault();
  };

  // Center on selected node when switching from treemap to mindmap
  useEffect(() => {
    if (justSwitchedView && nodes.length > 0 && containerRef.current) {
      // Find the selected node
      const selectedNode = nodes.find(node => node.isSelected);
      
      if (selectedNode) {
        const viewportWidth = containerRef.current.clientWidth;
        const viewportHeight = containerRef.current.clientHeight;
        
        // Add a small delay to ensure the layout is complete
        setTimeout(() => {
          centerOnNode(
            selectedNode.x,
            selectedNode.y,
            getNodeWidth(),
            getNodeHeight(),
            viewportWidth,
            viewportHeight
          );
          
          // Clear the switch flag
          if (onViewSwitchHandled) {
            onViewSwitchHandled();
          }
        }, 150);
      } else if (onViewSwitchHandled) {
        // Clear the flag even if no selected node is found
        onViewSwitchHandled();
      }
    }
  }, [justSwitchedView, nodes, centerOnNode, onViewSwitchHandled, getNodeWidth, getNodeHeight]);

  // Reset view when new tree data is loaded (new search/regeneration)
  useEffect(() => {
    // Only reset if we have actual tree data and it's not a view switch
    if (level1Items && level1Items.length > 0 && !justSwitchedView) {
      // Add a small delay to ensure the mindmap data has been fully processed
      const timeoutId = setTimeout(() => {
        resetView();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [query, level1Items?.length, resetView, justSwitchedView]); // Add justSwitchedView to dependency

  const toggleLayout = () => {
    setLayoutDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    // Automatically center the view after layout change
    setTimeout(() => {
      resetView();
    }, 100); // Small delay to ensure layout change has completed
  };

  // 展開状態を切り替える
  const handleToggleExpand = (nodeId: string, isExpanded: boolean) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const currentQuery = query || "Research Query";
    
    // 初回またはクエリが変更された場合のみ全展開にリセット
    if ((!isInitialized || currentQuery !== lastQuery) && nodes.length > 0) {
      const allNodeIds = nodes.map(node => node.id);
      setExpandedNodes(new Set(allNodeIds));
      setLastQuery(currentQuery);
      setIsInitialized(true);
    }
  }, [query, nodes, lastQuery, isInitialized]);

  // ノードデータに展開状態を適用
  const nodesWithExpandState = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      // ノードが展開されているかどうかを確認
      isExpanded: expandedNodes.has(node.id)
    }));
  }, [nodes, expandedNodes]);

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div 
        ref={containerRef} 
        className="w-full h-full overflow-hidden bg-white relative mindmap-outer-container"
        onWheelCapture={handleContainerWheel}
        style={{ touchAction: 'none' }}
      >
        <div
          className="w-full h-full relative mindmap-inner-container"
          onWheel={handleInnerWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: isDragging ? 'none' : 'auto',
            overflow: 'hidden', // Ensure no scrollbars appear
          }}
        >
          <div
            className="relative origin-top-left transition-transform duration-200 ease-out mindmap-content"
            style={{
              width: containerWidth,
              height: containerHeight,
              minWidth: "100%",
              minHeight: "100%",
              transform: getTransform(),
            }}
          >
            <MindMapConnections 
              connections={connections} 
              layoutDirection={layoutDirection} 
              selectedNodeId={selectedNodeForHighlight}
            />
            
            {nodesWithExpandState.map((node) => (
              <MindMapNodeComponent
                key={node.id}
                node={node}
                layoutDirection={layoutDirection}
                onClick={handleNodeClick}
                onEdit={onEditNode}
                onDelete={onDeleteNode}
                onAiAssist={handleAiAssist}
                onAddNode={handleAddNode}
                onToggleExpand={handleToggleExpand}
              />
            ))}
            
            {nodesWithExpandState.length === 0 && (
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
