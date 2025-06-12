
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
  
  const {
    expandedNodes,
    toggleNodeExpansion,
    isNodeExpanded,
  } = useMindMapState();

  // Initialize with root node expanded
  useEffect(() => {
    if (level1Items.length > 0) {
      toggleNodeExpansion(level1Items[0].id);
    }
  }, [level1Items]);

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const mindMapData = transformToMindMapData(
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
    expandedNodes
  );

  const positionedNodes = calculateNodePositions(mindMapData, containerSize.width, containerSize.height);

  const handleNodeClick = (nodeId: string) => {
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
    // Similar logic for edit
    if (onEditNode) {
      const level = getNodeLevel(nodeId);
      if (level) {
        onEditNode(level, nodeId, { title: "", description: "" });
      }
    }
  };

  const handleDeleteClick = (nodeId: string) => {
    if (onDeleteNode) {
      const level = getNodeLevel(nodeId);
      if (level) {
        onDeleteNode(level, nodeId);
      }
    }
  };

  const getNodeLevel = (nodeId: string): string | null => {
    if (level1Items.find(item => item.id === nodeId)) return "level1";
    if (Object.values(level2Items).flat().find(item => item.id === nodeId)) return "level2";
    if (Object.values(level3Items).flat().find(item => item.id === nodeId)) return "level3";
    if (Object.values(level4Items).flat().find(item => item.id === nodeId)) return "level4";
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
