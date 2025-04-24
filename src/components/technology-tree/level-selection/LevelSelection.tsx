
import React from "react";
import { LevelColumn } from "./LevelColumn";
import { ConnectionLines } from "./ConnectionLines";
import { useConnectionLines } from "./useConnectionLines";
import { toast } from "@/hooks/use-toast";

interface LevelSelectionProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
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
  const { level1to2Line, level2to3Line } = useConnectionLines();

  // Wrap the onNodeClick to show toast and trigger results update
  const handleNodeClick = (level: string, nodeId: string) => {
    onNodeClick(level, nodeId);
    
    // Only show toast and update results if actually selecting a new node
    if (selectedPath[level] !== nodeId) {
      // Create a custom event to refresh the paper list
      const refreshEvent = new CustomEvent('refresh-papers');
      document.dispatchEvent(refreshEvent);
      
      // Show notification to user
      toast({
        title: "Results updated",
        description: "The paper list has been updated based on your selection",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-row gap-6 mb-8 relative">
      <LevelColumn
        title="Level 1"
        subtitle={levelNames.level1}
        items={level1Items}
        selectedId={selectedPath.level1}
        onNodeClick={(nodeId) => handleNodeClick('level1', nodeId)}
      />

      <LevelColumn
        title="Level 2"
        subtitle={levelNames.level2}
        items={selectedPath.level1 ? level2Items[selectedPath.level1] || [] : []}
        selectedId={selectedPath.level2}
        onNodeClick={(nodeId) => handleNodeClick('level2', nodeId)}
      />

      <LevelColumn
        title="Level 3"
        subtitle={levelNames.level3}
        items={selectedPath.level2 ? level3Items[selectedPath.level2] || [] : []}
        selectedId={selectedPath.level3}
        onNodeClick={(nodeId) => handleNodeClick('level3', nodeId)}
      />

      <ConnectionLines
        level1to2Line={level1to2Line}
        level2to3Line={level2to3Line}
      />
    </div>
  );
};
