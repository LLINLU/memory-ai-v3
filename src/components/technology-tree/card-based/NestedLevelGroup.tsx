
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

  // Enhanced children detection function
  const hasChildrenForNode = (item: LevelItem): boolean => {
    // Check if the node has children in the current nextLevelItems
    const directChildren = nextLevelItems[item.id]?.length > 0;
    
    // For level 3 nodes, also check if they have level 4 children in allLevelItems
    if (currentLevel === 3) {
      const level4Children = allLevelItems.level4Items[item.id]?.length > 0;
      console.log(`[CHILDREN DEBUG] Level 3 node ${item.name} (${item.id}):`, {
        directChildren,
        level4Children,
        nextLevelItemsKeys: Object.keys(nextLevelItems),
        level4ItemsKeys: Object.keys(allLevelItems.level4Items),
        level4ChildrenArray: allLevelItems.level4Items[item.id]
      });
      return directChildren || level4Children;
    }
    
    // For other levels, check the appropriate level items
    if (currentLevel < 10) {
      const nextLevelItemsMap = getLevelItems(currentLevel + 1);
      const nextLevelChildren = nextLevelItemsMap[item.id]?.length > 0;
      console.log(`[CHILDREN DEBUG] Level ${currentLevel} node ${item.name} (${item.id}):`, {
        directChildren,
        nextLevelChildren,
        currentLevel,
        nextLevel: currentLevel + 1
      });
      return directChildren || nextLevelChildren;
    }
    
    return directChildren;
  };

  const renderNode = (item: LevelItem) => {
    const hasChildren = hasChildrenForNode(item);
    const childLevelKey = `${levelKey}-${item.id}`;
    const isSelected = selectedPath[levelNames2[currentLevel]] === item.id;
    const isExpanded = isLevelExpanded(childLevelKey);

    console.log(`[RENDER DEBUG] Rendering level ${currentLevel} node:`, {
      nodeName: item.name,
      nodeId: item.id,
      hasChildren,
      isExpanded,
      childLevelKey,
      currentLevel
    });

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

    // Get the correct children for rendering
    let childrenToRender: LevelItem[] = [];
    let nextLevelItemsForChildren: Record<string, LevelItem[]> = {};

    if (hasChildren && isExpanded) {
      // First try to get children from nextLevelItems
      childrenToRender = nextLevelItems[item.id] || [];
      
      // If no direct children but we're at level 3, get from level4Items
      if (childrenToRender.length === 0 && currentLevel === 3) {
        childrenToRender = allLevelItems.level4Items[item.id] || [];
        nextLevelItemsForChildren = getLevelItems(5); // level 5 items for level 4 children
      } else {
        nextLevelItemsForChildren = getLevelItems(currentLevel + 2); // next level items for children
      }

      console.log(`[CHILDREN RENDER DEBUG] Rendering children for level ${currentLevel} node ${item.name}:`, {
        childrenCount: childrenToRender.length,
        childrenFromNextLevel: nextLevelItems[item.id]?.length || 0,
        childrenFromLevel4: currentLevel === 3 ? allLevelItems.level4Items[item.id]?.length || 0 : 'N/A'
      });
    }

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
        {hasChildren && isExpanded && childrenToRender.length > 0 && (
          <NestedLevelGroup
            items={childrenToRender}
            selectedPath={selectedPath}
            scenarioId={scenarioId}
            currentLevel={currentLevel + 1}
            levelKey={childLevelKey}
            nextLevelItems={nextLevelItemsForChildren}
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

  // Debug logging for this level
  console.log(`[LEVEL DEBUG] NestedLevelGroup level ${currentLevel}:`, {
    itemsCount: items.length,
    nextLevelItemsKeys: Object.keys(nextLevelItems),
    level4ItemsKeys: Object.keys(allLevelItems.level4Items),
    scenarioId,
    levelKey
  });

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
