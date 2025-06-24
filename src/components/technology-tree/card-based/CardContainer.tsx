
import React from 'react';
import { ScenarioCard } from './ScenarioCard';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

type CardLayoutMode = "single-row" | "one-per-row" | "two-per-row" | "three-per-row";

interface CardContainerProps {
  cardLayout: CardLayoutMode;
  level1Items: LevelItem[];
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
  level2Items: Record<string, LevelItem[]>;
  allLevelItems: {
    level3Items: Record<string, LevelItem[]>;
    level4Items: Record<string, LevelItem[]>;
    level5Items: Record<string, LevelItem[]>;
    level6Items: Record<string, LevelItem[]>;
    level7Items: Record<string, LevelItem[]>;
    level8Items: Record<string, LevelItem[]>;
    level9Items: Record<string, LevelItem[]>;
    level10Items: Record<string, LevelItem[]>;
  };
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
  isScenarioExpanded: (scenarioId: string) => boolean;
  isLevelExpanded: (scenarioId: string, levelKey: string) => boolean;
  toggleScenarioExpansion: (scenarioId: string) => void;
  toggleLevelExpansion: (scenarioId: string, levelKey: string) => void;
  expandAll: (scenarioId: string, levelKeys: string[]) => void;
  collapseAll: (scenarioId: string) => void;
  getAllLevelKeys: (scenarioId: string) => string[];
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  cardLayout,
  level1Items,
  selectedPath,
  level2Items,
  allLevelItems,
  levelNames,
  isScenarioExpanded,
  isLevelExpanded,
  toggleScenarioExpansion,
  toggleLevelExpansion,
  expandAll,
  collapseAll,
  getAllLevelKeys,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {  const getLayoutClasses = () => {
    switch (cardLayout) {
      case "single-row":
        return "flex flex-nowrap overflow-x-auto overflow-y-visible";
      case "one-per-row":
        return "grid grid-cols-1";
      case "two-per-row":
        return "grid grid-cols-2";
      case "three-per-row":
        return "grid grid-cols-3";
      default:
        return "grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";
    }
  };

  const getCardClasses = () => {
    return cardLayout === "single-row" ? "flex-shrink-0 w-80 mr-4" : "";
  };

  return (
    <div className={`${getLayoutClasses()} gap-4`}>
      {level1Items.map((scenario) => {
        const scenarioLevel2Items = level2Items[scenario.id] || [];
        const isExpanded = isScenarioExpanded(scenario.id);
        const shouldTakeFullWidth = false;
        
        return (
          <div key={scenario.id} className={getCardClasses()}>
            <ScenarioCard
              scenario={scenario}
              selectedPath={selectedPath}
              level2Items={scenarioLevel2Items}
              allLevelItems={allLevelItems}
              levelNames={levelNames}
              isExpanded={isExpanded}
              isLevelExpanded={(levelKey) => isLevelExpanded(scenario.id, levelKey)}
              onToggleExpansion={() => toggleScenarioExpansion(scenario.id)}
              onToggleLevelExpansion={(levelKey) => toggleLevelExpansion(scenario.id, levelKey)}
              onExpandAll={() => expandAll(scenario.id, getAllLevelKeys(scenario.id))}
              onCollapseAll={() => collapseAll(scenario.id)}
              onNodeClick={onNodeClick}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
              shouldTakeFullWidth={shouldTakeFullWidth}
            />
          </div>
        );
      })}
    </div>
  );
};
