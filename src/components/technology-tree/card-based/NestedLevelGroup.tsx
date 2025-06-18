import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpandableNode } from './ExpandableNode';

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
  const levelNames2 = {
    2: 'level2',
    3: 'level3',
    4: 'level4',
    5: 'level5',
    6: 'level6',
    7: 'level7',
    8: 'level8',
    9: 'level9',
    10: 'level10',
  } as const;

  const getLevelLabel = (level: number): string => {
    switch (level) {
      case 2: return `レベル2:${levelNames.level2}`;
      case 3: return `レベル3:${levelNames.level3}`;
      case 4: return `レベル4:${levelNames.level4}`;
      case 5: return `レベル5:${levelNames.level5 || '手段'}`;
      case 6: return `レベル6:${levelNames.level6 || '技術'}`;
      case 7: return `レベル7:${levelNames.level7 || '実装'}`;
      case 8: return `レベル8:${levelNames.level8 || '詳細'}`;
      case 9: return `レベル9:${levelNames.level9 || '具体'}`;
      case 10: return `レベル10:${levelNames.level10 || '最終'}`;
      default: return `レベル${level}`;
    }
  };

  const getLevelItems = (level: number): Record<string, LevelItem[]> => {
    switch (level) {
      case 3: return allLevelItems.level3Items;
      case 4: return allLevelItems.level4Items;
      case 5: return allLevelItems.level5Items;
      case 6: return allLevelItems.level6Items;
      case 7: return allLevelItems.level7Items;
      case 8: return allLevelItems.level8Items;
      case 9: return allLevelItems.level9Items;
      case 10: return allLevelItems.level10Items;
      default: return {};
    }
  };

  const renderNode = (item: LevelItem) => {
    const hasChildren = nextLevelItems[item.id]?.length > 0;
    const childLevelKey = `${levelKey}-${item.id}`;
    const isSelected = selectedPath[levelNames2[currentLevel]] === item.id;
    const isExpanded = isLevelExpanded(childLevelKey);

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEditNode) {
        onEditNode(levelNames2[currentLevel], item.id, { title: item.name, description: item.description || '' });
      }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteNode) {
        onDeleteNode(levelNames2[currentLevel], item.id);
      }
    };

    return (
      <ExpandableNode
        key={item.id}
        item={item}
        isSelected={isSelected}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onToggleExpansion={() => toggleLevelExpansion(childLevelKey)}
        onNodeClick={() => onNodeClick(levelNames2[currentLevel], item.id)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        level={currentLevel}
      >
        {hasChildren && isExpanded && (
          <NestedLevelGroup
            items={nextLevelItems[item.id]}
            selectedPath={selectedPath}
            scenarioId={scenarioId}
            currentLevel={currentLevel + 1}
            levelKey={childLevelKey}
            nextLevelItems={getLevelItems(currentLevel + 1)}
            allLevelItems={allLevelItems}
            levelNames={levelNames}
            onNodeClick={onNodeClick}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
            isLevelExpanded={isLevelExpanded}
            toggleLevelExpansion={toggleLevelExpansion}
          />
        )}
      </ExpandableNode>
    );
  };

  return (
    <div className="space-y-2">
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {getLevelLabel(currentLevel)}
        </Badge>
      </div>
      {items.map(renderNode)}
    </div>
  );
};
