import React, { useEffect, useState, useRef } from "react";
import { MindMapNode } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { useMindMapState } from "@/hooks/tree/useMindMapState";
import { transformToMindMapData, calculateNodePositions } from "@/utils/mindMapDataTransform";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface MindMapContainerProps {
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  level5Items?: Record<string, any[]>;
  level6Items?: Record<string, any[]>;
  level7Items?: Record<string, any[]>;
  level8Items?: Record<string, any[]>;
  level9Items?: Record<string, any[]>;
  level10Items?: Record<string, any[]>;
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

export const MindMapContainer: React.FC<MindMapContainerProps> = ({
  level1Items,
  level2Items,
  level3Items,
  level4Items,
  level5Items = {},
  level6Items = {},
  level7Items = {},
  level8Items = {},
  level9Items = {},
  level10Items = {},
  selectedPath,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    expandedNodes,
    toggleNodeExpansion,
    isNodeExpanded,
    expandNode,
  } = useMindMapState();

  // Debug data
  useEffect(() => {
    console.log("🗺️ MindMapContainer received data:", {
      level1Count: level1Items?.length || 0,
      level2Count: Object.keys(level2Items || {}).length,
      level3Count: Object.keys(level3Items || {}).length,
      level4Count: Object.keys(level4Items || {}).length,
      selectedPath,
      expandedNodes: Array.from(expandedNodes),
    });
  }, [level1Items, level2Items, level3Items, level4Items, expandedNodes]);

  // Initialize with all root nodes expanded
  useEffect(() => {
    if (level1Items && level1Items.length > 0 && !isInitialized) {
      console.log("🌱 Auto-expanding all root nodes for better visibility");
      level1Items.forEach(item => {
        console.log(`🌱 Expanding root node: ${item.name} (${item.id})`);
        expandNode(item.id);
      });
      setIsInitialized(true);
    }
  }, [level1Items, expandNode, isInitialized]);

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newSize = { width: Math.max(rect.width, 800), height: Math.max(rect.height, 600) };
        console.log("📏 Container size updated:", newSize);
        setContainerSize(newSize);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Transform data
  const mindMapData = transformToMindMapData(
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
    expandedNodes
  );

  // Calculate positions for ALL nodes
  const positionedNodes = calculateNodePositions(mindMapData, containerSize.width, containerSize.height);

  const handleNodeClick = (nodeId: string) => {
    console.log("🎯 Node clicked:", nodeId);
    // Find the node level based on the path structure
    if (selectedPath.level1 === nodeId) {
      onNodeClick("level1", nodeId);
    } else if (Object.values(level2Items).flat().find(item => item.id === nodeId)) {
      onNodeClick("level2", nodeId);
    } else if (Object.values(level3Items).flat().find(item => item.id === nodeId)) {
      onNodeClick("level3", nodeId);
    } else if (Object.values(level4Items).flat().find(item => item.id === nodeId)) {
      onNodeClick("level4", nodeId);
    }
  };

  const handleEditClick = (nodeId: string) => {
    console.log("✏️ Edit clicked:", nodeId);
    if (onEditNode) {
      const level = getNodeLevel(nodeId);
      if (level) {
        onEditNode(level, nodeId, { title: "", description: "" });
      }
    }
  };

  const handleDeleteClick = (nodeId: string) => {
    console.log("🗑️ Delete clicked:", nodeId);
    if (onDeleteNode) {
      const level = getNodeLevel(nodeId);
      if (level) {
        onDeleteNode(level, nodeId);
      }
    }
  };

  const getNodeLevel = (nodeId: string): string | null => {
    if (level1Items?.find(item => item.id === nodeId)) return "level1";
    if (Object.values(level2Items || {}).flat().find(item => item.id === nodeId)) return "level2";
    if (Object.values(level3Items || {}).flat().find(item => item.id === nodeId)) return "level3";
    if (Object.values(level4Items || {}).flat().find(item => item.id === nodeId)) return "level4";
    return null;
  };

  const getCurrentlySelectedNode = (): string => {
    return selectedPath.level4 || selectedPath.level3 || selectedPath.level2 || selectedPath.level1;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.3));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Loading and error states
  if (!level1Items || level1Items.length === 0) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center" ref={containerRef}>
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">マインドマップデータなし</h3>
          <p className="text-gray-600">技術ツリーデータが読み込まれていません。</p>
        </div>
      </div>
    );
  }

  if (positionedNodes.length === 0) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center" ref={containerRef}>
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">ノードが見つかりません</h3>
          <p className="text-gray-600">表示可能なノードがありません。データを確認してください。</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug Info:</p>
            <p>Level 1 Items: {level1Items?.length || 0}</p>
            <p>Expanded Nodes: {expandedNodes.size}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50" ref={containerRef}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Debug info */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded text-xs">
        <div>Root Nodes: {positionedNodes.length}</div>
        <div>Expanded: {expandedNodes.size}</div>
        <div>Zoom: {zoom.toFixed(1)}x</div>
      </div>

      {/* Mind Map Content */}
      <div
        className="relative w-full h-full"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center',
          transition: 'transform 0.2s ease',
        }}
      >
        <MindMapConnections nodes={positionedNodes} />
        
        {positionedNodes.map((node) => (
          <MindMapNode
            key={node.id}
            node={node}
            isSelected={getCurrentlySelectedNode() === node.id}
            onToggleExpansion={toggleNodeExpansion}
            onNodeClick={handleNodeClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
    </div>
  );
};
