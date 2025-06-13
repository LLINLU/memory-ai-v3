
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  Simulation,
} from "d3-force";
import { zoomIdentity, zoom, ZoomTransform } from "d3-zoom";
import * as d3 from "d3";
import { MindMapNodeComponent } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { transformToMindMapData, MindMapNode } from "@/utils/mindMapDataTransform";
import { MindMapControls } from "./MindMapControls";

interface MindMapContainerProps {
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
  levelNames?: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  query?: string;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

export const MindMapContainer: React.FC<MindMapContainerProps> = ({
  selectedPath,
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
  levelNames,
  query,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomTransform>(zoomIdentity);
  const simulationRef = useRef<Simulation<MindMapNode, undefined> | null>(null);

  // Transform data into a format suitable for the mind map
  useEffect(() => {
    const { nodes: transformedNodes, connections: transformedConnections } = transformToMindMapData(
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
      levelNames || {
        level1: "Level 1",
        level2: "Level 2", 
        level3: "Level 3",
        level4: "Level 4"
      },
      selectedPath,
      query || "Research Query"
    );
    setNodes(transformedNodes);
    setConnections(transformedConnections);
  }, [
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
  ]);

  // Initialize the force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulation = forceSimulation<MindMapNode, undefined>(nodes)
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(0, 0))
      .force("collision", forceCollide().radius(80))
      .on("tick", () => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({ ...node }))
        );
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes]);

  // Zoom functionality
  const handleZoom = useCallback(
    (transform: ZoomTransform) => {
      zoomRef.current = transform;
      setZoom(transform.k);
      setPan({ x: transform.x, y: transform.y });
    },
    []
  );

  // Initialize zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomBehavior = zoom<SVGSVGElement, any>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        handleZoom(event.transform);
      });

    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, zoomIdentity); // Apply initial transform
  }, [handleZoom]);

  // Pan functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging) return;

      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;

      setPan((prevPan) => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy,
      }));

      setDragStart({ x: event.clientX, y: event.clientY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prevZoom) => Math.max(0.1, Math.min(4, prevZoom * scaleFactor)));
  }, []);

  // Reset view
  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(750).call(
        zoom<SVGSVGElement, any>().transform,
        zoomIdentity
      );
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Fit to screen
  const handleFitToScreen = () => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = svgRef.current.getBoundingClientRect();

    // Calculate the bounding box of all nodes
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    nodes.forEach((node) => {
      minX = Math.min(minX, node.x - 80); // 80 is an approximation of node radius
      minY = Math.min(minY, node.y - 40);
      maxX = Math.max(maxX, node.x + 80);
      maxY = Math.max(maxY, node.y + 40);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = width / contentWidth;
    const scaleY = height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in more than 1x

    const translateX = width / 2 - scale * (minX + contentWidth / 2);
    const translateY = height / 2 - scale * (minY + contentHeight / 2);

    svg.transition().duration(750).call(
      zoom<SVGSVGElement, any>().transform,
      zoomIdentity.translate(translateX, translateY).scale(scale)
    );

    setZoom(scale);
    setPan({ x: translateX, y: translateY });
  };

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(750).call(
        zoom<SVGSVGElement, any>().scaleBy, 1.2
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(750).call(
        zoom<SVGSVGElement, any>().scaleBy, 1 / 1.2
      );
    }
  };

  const handleAiAssistant = (nodeId: string, title: string) => {
    console.log('AI Assistant clicked for node:', nodeId, title);
    // TODO: Implement AI assistant functionality
  };

  const handleAddNode = (nodeId: string, level: number) => {
    console.log('Add node clicked for parent node:', nodeId, 'at level:', level);
    // TODO: Implement add node functionality
  };

  const handleCopyTitle = (title: string) => {
    console.log('Title copied:', title);
    // Optional: Show toast notification
  };

  // Fix the onClick handler to match the expected signature
  const handleNodeClick = (nodeId: string, level: number) => {
    onNodeClick(`level${level}`, nodeId);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-50">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10">
        <MindMapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToScreen={handleFitToScreen}
        />
      </div>

      {/* SVG Container */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Connections */}
          <MindMapConnections connections={connections} />
        </g>
      </svg>

      {/* Nodes Container */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <div className="relative pointer-events-auto">
          {nodes.map((node) => (
            <MindMapNodeComponent
              key={node.id}
              node={node}
              onClick={handleNodeClick}
              onEdit={onEditNode}
              onDelete={onDeleteNode}
              onAiAssistant={handleAiAssistant}
              onAddNode={handleAddNode}
              onCopyTitle={handleCopyTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
