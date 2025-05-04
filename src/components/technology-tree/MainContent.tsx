
import React from 'react';
import { PathDisplay } from "./PathDisplay";
import { LevelSelection } from "./LevelSelection";

interface MainContentProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  levelNames?: {
    level1: string;
    level2: string;
    level3: string;
  };
  query?: string;
  hasUserMadeSelection: boolean;
}

export const MainContent = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  levelNames = {
    level1: "Purpose (Why)",
    level2: "Function (What)",
    level3: "Measure/Technology (How)"
  },
  query
}: MainContentProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PathDisplay 
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
      />
      <LevelSelection
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
        onNodeClick={onNodeClick}
        onEditNode={onEditNode}
        onDeleteNode={onDeleteNode}
        levelNames={levelNames}
      />
    </div>
  );
};
