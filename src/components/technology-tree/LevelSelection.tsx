
import React, { useRef, useState, useEffect } from "react";
import { LevelColumn } from "./level-selection/LevelColumn";
import { ConnectionLines } from "./level-selection/ConnectionLines";
import { useConnectionLines } from "./level-selection/useConnectionLines";
import { toast } from "@/hooks/use-toast";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
}

interface LevelSelectionProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: LevelItem[];
  level2Items: Record<string, LevelItem[]>;
  level3Items: Record<string, LevelItem[]>;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  levelNames: {
    level1: string;
    level2: string;
    level3: string;
  };
}

export const LevelSelection = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  levelNames
}: LevelSelectionProps) => {
  // Reorder items to ensure selected items appear first
  const reorderedLevel1Items = React.useMemo(() => {
    const items = [...level1Items];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level1);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level1Items, selectedPath.level1]);

  const visibleLevel2Items = React.useMemo(() => {
    if (!selectedPath.level1) return [];
    const items = [...(level2Items[selectedPath.level1] || [])];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level2);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level2Items, selectedPath]);

  const visibleLevel3Items = React.useMemo(() => {
    if (!selectedPath.level2) return [];
    const items = [...(level3Items[selectedPath.level2] || [])];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level3);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level3Items, selectedPath]);

  const [level2to3Line, setLevel2to3Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [level1to2Line, setLevel1to2Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useConnectionLines(containerRef, selectedPath, setLevel1to2Line, setLevel2to3Line);

  const handleNodeSelection = (level: string, nodeId: string) => {
    if (selectedPath[level] !== nodeId) {
      // Create custom event to refresh paper list with node information
      const refreshEvent = new CustomEvent('refresh-papers', {
        detail: { level, nodeId, timestamp: Date.now() }
      });
      document.dispatchEvent(refreshEvent);
      
      // Show notification to user with 1-second duration
      toast({
        title: "Results updated",
        description: "The paper list has been updated based on your selection",
        duration: 1000,
      });
      
      console.log("Node selection event:", { level, nodeId, refreshEvent });
    }
    
    onNodeClick(level, nodeId);
  };

  const handleEditNode = (level: string, nodeId: string, updatedNode: { title: string; description: string }) => {
    if (onEditNode) {
      onEditNode(level, nodeId, updatedNode);
      toast({
        title: "Node updated",
        description: `Changes to "${updatedNode.title}" have been saved`,
        duration: 2000,
      });
    }
  };

  const handleDeleteNode = (level: string, nodeId: string) => {
    if (onDeleteNode) {
      onDeleteNode(level, nodeId);
      toast({
        title: "ノードが削除されました",
        description: "ノードは正常に削除されました",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-row gap-6 mb-8 relative" ref={containerRef}>
      <LevelColumn
        title="レベル1"
        subtitle={levelNames.level1}
        items={reorderedLevel1Items}
        selectedId={selectedPath.level1}
        onNodeClick={(nodeId) => handleNodeSelection('level1', nodeId)}
        onEditNode={(nodeId, updatedNode) => handleEditNode('level1', nodeId, updatedNode)}
        onDeleteNode={(nodeId) => handleDeleteNode('level1', nodeId)}
      />

      <LevelColumn
        title="レベル2"
        subtitle={levelNames.level2}
        items={visibleLevel2Items}
        selectedId={selectedPath.level2}
        onNodeClick={(nodeId) => handleNodeSelection('level2', nodeId)}
        onEditNode={(nodeId, updatedNode) => handleEditNode('level2', nodeId, updatedNode)}
        onDeleteNode={(nodeId) => handleDeleteNode('level2', nodeId)}
      />

      <LevelColumn
        title="レベル3"
        subtitle={levelNames.level3}
        items={visibleLevel3Items}
        selectedId={selectedPath.level3}
        onNodeClick={(nodeId) => handleNodeSelection('level3', nodeId)}
        onEditNode={(nodeId, updatedNode) => handleEditNode('level3', nodeId, updatedNode)}
        onDeleteNode={(nodeId) => handleDeleteNode('level3', nodeId)}
      />

      <ConnectionLines
        level1to2Line={level1to2Line}
        level2to3Line={level2to3Line}
      />
    </div>
  );
};
