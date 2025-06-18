
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NodeRenderer } from './components/NodeRenderer';
import { getLevelLabel } from './utils/LevelUtils';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface NestedLevelGroupProps {
  items: LevelItem[];
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
  scenarioId: string;
  currentLevel: number;
  levelKey: string;
  nextLevelItems: Record<string, LevelItem[]>;
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
  isLevelExpanded: (levelKey: string) => boolean;
  toggleLevelExpansion: (levelKey: string) => void;
}

export const NestedLevelGroup: React.FC<NestedLevelGroupProps> = ({
  items,
  selectedPath,
  scenarioId,
  currentLevel,
  levelKey,
  nextLevelItems,
  allLevelItems,
  levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  },
  onNodeClick,
  onEditNode,
  onDeleteNode,
  isLevelExpanded,
  toggleLevelExpansion,
}) => {
  return (
    <div className="space-y-2">
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {getLevelLabel(currentLevel, levelNames)}
        </Badge>
      </div>
      {items.map((item) => (
        <NodeRenderer
          key={item.id}
          item={item}
          selectedPath={selectedPath}
          scenarioId={scenarioId}
          currentLevel={currentLevel}
          levelKey={levelKey}
          nextLevelItems={nextLevelItems}
          allLevelItems={allLevelItems}
          levelNames={levelNames}
          onNodeClick={onNodeClick}
          onEditNode={onEditNode}
          onDeleteNode={onDeleteNode}
          isLevelExpanded={isLevelExpanded}
          toggleLevelExpansion={toggleLevelExpansion}
        />
      ))}
    </div>
  );
};
