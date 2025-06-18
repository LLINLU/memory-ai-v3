
import React from 'react';
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
  onNodeClick,
  onEditNode,
  onDeleteNode,
  isLevelExpanded,
  toggleLevelExpansion,
}) => {
  const levelNames = {
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
    const isSelected = selectedPath[levelNames[currentLevel]] === item.id;
    const isExpanded = isLevelExpanded(childLevelKey);

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEditNode) {
        onEditNode(levelNames[currentLevel], item.id, { title: item.name, description: item.description || '' });
      }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteNode) {
        onDeleteNode(levelNames[currentLevel], item.id);
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
        onNodeClick={() => onNodeClick(levelNames[currentLevel], item.id)}
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
      {items.map(renderNode)}
    </div>
  );
};
