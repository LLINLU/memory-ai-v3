
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NodeRenderer } from './components/NodeRenderer';
import { getLevelLabel } from './utils/LevelUtils';
import { getLevelBadgeClasses } from '@/utils/levelColors';

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
  // NEW: Visual selection props
  visuallySelectedNode?: { level: number; nodeId: string } | null;
  onVisualSelection?: (level: number, nodeId: string) => void;
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
  visuallySelectedNode,
  onVisualSelection,
}) => {
  return (
    <div className="space-y-2">
      <div className="ml-6 mb-2">
        <Badge className={`text-xs ${getLevelBadgeClasses(currentLevel)}`}>
          {getLevelLabel(currentLevel, levelNames)}
        </Badge>
      </div>
      <div className={`space-y-2 ${currentLevel >= 2 ? 'max-w-4xl' : ''}`}>
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
            visuallySelectedNode={visuallySelectedNode}
            onVisualSelection={onVisualSelection}
          />
        ))}
      </div>
    </div>
  );
};
