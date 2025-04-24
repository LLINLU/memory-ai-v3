
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
  levelNames
}: LevelSelectionProps) => {
  const visibleLevel2Items = selectedPath.level1 ? level2Items[selectedPath.level1] || [] : [];
  const visibleLevel3Items = selectedPath.level2 ? level3Items[selectedPath.level2] || [] : [];
  const [level2to3Line, setLevel2to3Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [level1to2Line, setLevel1to2Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useConnectionLines(containerRef, selectedPath, setLevel1to2Line, setLevel2to3Line);

  const handleNodeSelection = (level: string, nodeId: string) => {
    // Only show toast if actually selecting a new node
    if (selectedPath[level] !== nodeId) {
      // Create custom event to refresh paper list
      const refreshEvent = new CustomEvent('refresh-papers');
      document.dispatchEvent(refreshEvent);
      
      // Show notification to user with 1-second duration
      toast({
        title: "Results updated",
        description: "The paper list has been updated based on your selection",
        duration: 1000, // Explicitly set to 1 second
      });
      
      console.log("Toast triggered for node selection", { level, nodeId });
    }
    
    onNodeClick(level, nodeId);
  };

  return (
    <div className="flex flex-row gap-6 mb-8 relative" ref={containerRef}>
      <LevelColumn
        title="Level 1"
        subtitle={levelNames.level1}
        items={level1Items}
        selectedId={selectedPath.level1}
        onNodeClick={(nodeId) => handleNodeSelection('level1', nodeId)}
      />

      <LevelColumn
        title="Level 2"
        subtitle={levelNames.level2}
        items={visibleLevel2Items}
        selectedId={selectedPath.level2}
        onNodeClick={(nodeId) => handleNodeSelection('level2', nodeId)}
      />

      <LevelColumn
        title="Level 3"
        subtitle={levelNames.level3}
        items={visibleLevel3Items}
        selectedId={selectedPath.level3}
        onNodeClick={(nodeId) => handleNodeSelection('level3', nodeId)}
      />

      <ConnectionLines
        level1to2Line={level1to2Line}
        level2to3Line={level2to3Line}
      />
    </div>
  );
};
