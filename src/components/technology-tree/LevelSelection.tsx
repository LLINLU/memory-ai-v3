
import React, { useRef, useState } from "react";
import { LevelColumn } from "./level-selection/LevelColumn";
import { ConnectionLines } from "./level-selection/ConnectionLines";
import { useConnectionLines } from "./level-selection/useConnectionLines";

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

  return (
    <div className="flex flex-row gap-6 mb-8 relative" ref={containerRef}>
      <LevelColumn
        title="Level 1"
        subtitle={levelNames.level1}
        items={level1Items}
        selectedId={selectedPath.level1}
        onNodeClick={(nodeId) => onNodeClick('level1', nodeId)}
      />

      <LevelColumn
        title="Level 2"
        subtitle={levelNames.level2}
        items={visibleLevel2Items}
        selectedId={selectedPath.level2}
        onNodeClick={(nodeId) => onNodeClick('level2', nodeId)}
      />

      <LevelColumn
        title="Level 3"
        subtitle={levelNames.level3}
        items={visibleLevel3Items}
        selectedId={selectedPath.level3}
        onNodeClick={(nodeId) => onNodeClick('level3', nodeId)}
      />

      <ConnectionLines
        level1to2Line={level1to2Line}
        level2to3Line={level2to3Line}
      />
    </div>
  );
};

