
import React, { useState } from 'react';
import { Grid, LayoutGrid, Square, Columns2, Columns3 } from 'lucide-react';
import { ScenarioCard } from './ScenarioCard';
import { useCardExpansion } from './hooks/useCardExpansion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface CardBasedTreemapProps {
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
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

type CardLayoutMode = "single-row" | "one-per-row" | "two-per-row" | "three-per-row";

export const CardBasedTreemap: React.FC<CardBasedTreemapProps> = ({
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
  levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  },
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const [cardLayout, setCardLayout] = useState<CardLayoutMode>("three-per-row");
  
  const {
    toggleScenarioExpansion,
    toggleLevelExpansion,
    expandAll,
    collapseAll,
    isScenarioExpanded,
    isLevelExpanded,
  } = useCardExpansion();

  const allLevelItems = {
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
  };

  const getAllLevelKeys = (scenarioId: string): string[] => {
    const keys: string[] = [];
    
    const addKeysRecursively = (items: LevelItem[], prefix: string, level: number) => {
      items.forEach(item => {
        const key = `${prefix}-${item.id}`;
        keys.push(key);
        
        const nextLevelItems = level === 2 ? level3Items[item.id] :
                              level === 3 ? level4Items[item.id] :
                              level === 4 ? level5Items[item.id] :
                              level === 5 ? level6Items[item.id] :
                              level === 6 ? level7Items[item.id] :
                              level === 7 ? level8Items[item.id] :
                              level === 8 ? level9Items[item.id] :
                              level === 9 ? level10Items[item.id] : [];
        
        if (nextLevelItems?.length > 0) {
          addKeysRecursively(nextLevelItems, key, level + 1);
        }
      });
    };

    const scenarioLevel2Items = level2Items[scenarioId] || [];
    addKeysRecursively(scenarioLevel2Items, scenarioId, 2);
    return keys;
  };

  const getLayoutClasses = () => {
    switch (cardLayout) {
      case "single-row":
        return "flex flex-nowrap overflow-x-auto";
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
    <div className="h-full overflow-y-auto p-4">
      {/* Layout Toggle Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">カードレイアウト</h3>
          <ToggleGroup 
            type="single" 
            value={cardLayout} 
            onValueChange={(value) => value && setCardLayout(value as CardLayoutMode)}
            className="bg-gray-50 p-1 rounded-lg"
          >
            <ToggleGroupItem value="single-row" aria-label="Single row layout" className="data-[state=on]:bg-white">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="one-per-row" aria-label="One card per row" className="data-[state=on]:bg-white">
              <Square className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="two-per-row" aria-label="Two cards per row" className="data-[state=on]:bg-white">
              <Columns2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="three-per-row" aria-label="Three cards per row" className="data-[state=on]:bg-white">
              <Columns3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Cards Container */}
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
    </div>
  );
};
