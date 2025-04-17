
import React from 'react';
import { TechnologyHeader } from "./TechnologyHeader";
import { PathDisplay } from "./PathDisplay";
import { ZoomControls } from "./ZoomControls";
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
  levelNames = {
    level1: "Main Domains",
    level2: "Sub-domains",
    level3: "Specific Topics/Techniques"
  },
  query,
  hasUserMadeSelection
}: MainContentProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <TechnologyHeader query={query} />
      <PathDisplay 
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
      />
      <ZoomControls hasUserMadeSelection={hasUserMadeSelection} />
      <LevelSelection
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
        onNodeClick={onNodeClick}
        levelNames={levelNames}
      />
    </div>
  );
};
