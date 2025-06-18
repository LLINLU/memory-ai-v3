
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpandableNode } from './ExpandableNode';
import { getLevelBadgeStyle } from '../utils/levelColors';

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
  isNodeVisuallySelected: (level: string, nodeId: string) => boolean;
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
  isNodeVisuallySelected,
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
      return directChildren || level4Children;
    }
    
    // For other levels, check the appropriate level items
    if (currentLevel < 10) {
      const nextLevelItemsMap = getLevelItems(currentLevel + 1);
      const nextLevelChildren = nextLevelItemsMap[item.id]?.length > 0;
      return directChildren || nextLevelChildren;
    }
    
    return directChildren;
  };

  // Enhanced selection validation function
  const isNodeSelected = (item: LevelItem): boolean => {
    const currentLevelKey = levelNames2[currentLevel];
    const currentLevelSelection = selectedPath[currentLevelKey];
    
    // First check if this node is selected at the current level
    if (currentLevelSelection !== item.id) {
      return false;
    }
    
    // Then validate that the full path is valid by checking parent selections
    // For level 2, must have valid level 1 selection (scenarioId)
    if (currentLevel === 2) {
      return selectedPath.level1 === scenarioId;
    }
    
    // For level 3, must have valid level 1 and level 2 selections
    if (currentLevel === 3) {
      if (selectedPath.level1 !== scenarioId || !selectedPath.level2) {
        return false;
      }
      // Check if this level 3 item exists under the selected level 2 item
      const level2Items = allLevelItems.level3Items[selectedPath.level2] || [];
      return level2Items.some(l3Item => l3Item.id === item.id);
    }
    
    // For level 4, must have valid level 1, 2, and 3 selections
    if (currentLevel === 4) {
      if (selectedPath.level1 !== scenarioId || !selectedPath.level2 || !selectedPath.level3) {
        return false;
      }
      // Check if this level 4 item exists under the selected level 3 item
      const level3Items = allLevelItems.level4Items[selectedPath.level3] || [];
      return level3Items.some(l4Item => l4Item.id === item.id);
    }
    
    // For higher levels, follow the same pattern
    if (currentLevel >= 5) {
      // Validate all parent levels are selected
      const requiredLevels = ['level1', 'level2', 'level3', 'level4'];
      for (let i = 5; i < currentLevel; i++) {
        requiredLevels.push(`level${i}` as keyof typeof selectedPath);
      }
      
      for (const level of requiredLevels) {
        if (!selectedPath[level as keyof typeof selectedPath]) {
          return false;
        }
      }
      
      // Check if this item exists under the selected parent
      const parentLevel = currentLevel - 1;
      const parentKey = `level${parentLevel}` as keyof typeof selectedPath;
      const parentId = selectedPath[parentKey];
      
      if (!parentId) return false;
      
      const parentLevelItems = getLevelItems(currentLevel);
      const currentLevelItems = parentLevelItems[parentId] || [];
      return currentLevelItems.some(item_check => item_check.id === item.id);
    }
    
    return false;
  };

  const renderNode = (item: LevelItem) => {
    const hasChildren = hasChildrenForNode(item);
    const childLevelKey = `${levelKey}-${item.id}`;
    const isVisuallySelected = isNodeVisuallySelected(levelNames2[currentLevel], item.id);
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
    }

    return (
      <ExpandableNode
        key={item.id}
        item={item}
        isSelected={isVisuallySelected}
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
            isNodeVisuallySelected={isNodeVisuallySelected}
          />
        )}
      </ExpandableNode>
    );
  };

  return (
    <div className="space-y-2">
      <div className="mb-3">
        <Badge variant="outline" className={`text-xs ${getLevelBadgeStyle(currentLevel)}`}>
          {getLevelLabel(currentLevel)}
        </Badge>
      </div>
      {items.map(renderNode)}
    </div>
  );
};
