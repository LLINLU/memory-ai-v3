
import React from 'react';
import { TechnologyHeader } from "./TechnologyHeader";
import { PathDisplay } from "./PathDisplay";
import { ZoomControls } from "./ZoomControls";
import { LevelSelection } from "./LevelSelection";
import { ActionButtons } from "./ActionButtons";

interface MainContentProps {
  selectedPath: {
    level1: string[];
    level2: string[];
    level3: string[];
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  onNodeClick: (level: string, nodeId: string) => void;
}

export const MainContent = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick,
}: MainContentProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <TechnologyHeader />
      <PathDisplay 
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
      />
      <ZoomControls />
      <LevelSelection
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
        onNodeClick={onNodeClick}
      />
      <ActionButtons />
    </div>
  );
};
