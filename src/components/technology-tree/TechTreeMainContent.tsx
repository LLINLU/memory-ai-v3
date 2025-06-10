
import React from "react";
import { LevelSelection } from "./LevelSelection";
import { ScenarioSection } from "./ScenarioSection";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
}

interface TechTreeMainContentProps {
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
  level1Items: LevelItem[];
  level2Items: Record<string, LevelItem[]>;
  level3Items: Record<string, LevelItem[]>;
  level4Items: Record<string, LevelItem[]>;
  level5Items?: Record<string, LevelItem[]>;
  level6Items?: Record<string, LevelItem[]>;
  level7Items?: Record<string, LevelItem[]>;
  level8Items?: Record<string, LevelItem[]>;
  level9Items?: Record<string, LevelItem[]>;
  level10Items?: Record<string, LevelItem[]>;
  showLevel4: boolean;
  handleNodeClick: (level: string, nodeId: string) => void;
  editNode?: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  deleteNode?: (level: string, nodeId: string) => void;
  levelNames: {
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
  hasUserMadeSelection: boolean;
  scenario: string;
  onEditScenario: (newScenario: string) => void;
  conversationHistory?: any[];
  handleAddLevel4: () => void;
  searchMode?: string;
  onGuidanceClick: (type: string) => void;
  query?: string;
  treeMode?: string;
  onScrollToStart: () => void;
  onScrollToEnd: () => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  lastVisibleLevel: number;
  containerRef: React.RefObject<HTMLDivElement>;
  triggerScrollUpdate: () => void;
  onNodeCreationHelp?: () => void;
}

export const TechTreeMainContent: React.FC<TechTreeMainContentProps> = ({
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
  showLevel4,
  handleNodeClick,
  editNode,
  deleteNode,
  levelNames,
  hasUserMadeSelection,
  scenario,
  onEditScenario,
  conversationHistory = [],
  handleAddLevel4,
  searchMode,
  onGuidanceClick,
  query,
  treeMode,
  onScrollToStart,
  onScrollToEnd,
  canScrollLeft,
  canScrollRight,
  lastVisibleLevel,
  containerRef,
  triggerScrollUpdate,
  onNodeCreationHelp,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScenarioSection
        scenario={scenario}
        onEditScenario={onEditScenario}
        searchMode={searchMode}
        onGuidanceClick={onGuidanceClick}
        query={query}
        treeMode={treeMode}
        onScrollToStart={onScrollToStart}
        onScrollToEnd={onScrollToEnd}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        lastVisibleLevel={lastVisibleLevel}
        triggerScrollUpdate={triggerScrollUpdate}
      />
      
      <div className="flex-1 overflow-hidden">
        <LevelSelection
          selectedPath={selectedPath}
          level1Items={level1Items}
          level2Items={level2Items}
          level3Items={level3Items}
          level4Items={level4Items}
          level5Items={level5Items}
          level6Items={level6Items}
          level7Items={level7Items}
          level8Items={level8Items}
          level9Items={level9Items}
          level10Items={level10Items}
          showLevel4={showLevel4}
          onNodeClick={handleNodeClick}
          onEditNode={editNode}
          onDeleteNode={deleteNode}
          levelNames={levelNames}
          containerRef={containerRef}
          onNodeCreationHelp={onNodeCreationHelp}
        />
      </div>
    </div>
  );
};
