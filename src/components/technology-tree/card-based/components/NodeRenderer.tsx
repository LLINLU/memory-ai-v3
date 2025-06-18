import React from 'react';
import { ExpandableNode } from '../ExpandableNode';
import { NestedLevelGroup } from '../NestedLevelGroup';
import { isNodeVisuallySelected } from '../utils/SelectionLogic';
import { hasChildrenForNode, getLevelItems } from '../utils/LevelUtils';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface NodeRendererProps {
  item: LevelItem;
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
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  isLevelExpanded: (levelKey: string) => boolean;
  toggleLevelExpansion: (levelKey: string) => void;
  // NEW: Visual selection props
  visuallySelectedNode?: { level: number; nodeId: string } | null;
  onVisualSelection?: (level: number, nodeId: string) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  item,
  selectedPath,
  scenarioId,
  currentLevel,
  levelKey,
  nextLevelItems,
  allLevelItems,
  levelNames,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  isLevelExpanded,
  toggleLevelExpansion,
  visuallySelectedNode,
  onVisualSelection,
}) => {
  const levelNames2 = {
    1: 'level1',
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

  const hasChildren = hasChildrenForNode(item, nextLevelItems, currentLevel, allLevelItems);
  const childLevelKey = `${levelKey}-${item.id}`;
  
  // Use visual selection for background highlighting
  const isSelected = isNodeVisuallySelected(item.id, currentLevel, visuallySelectedNode);
  const isExpanded = isLevelExpanded(childLevelKey);

  const handleNodeClick = () => {
    console.log(`NodeRenderer: Clicking node at level ${currentLevel} with id ${item.id}, mapping to ${levelNames2[currentLevel]}`);
    
    // Update path logic (for navigation)
    onNodeClick(levelNames2[currentLevel], item.id);
    
    // Update visual selection (for background highlighting)
    if (onVisualSelection) {
      onVisualSelection(currentLevel, item.id);
    }
  };

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
      nextLevelItemsForChildren = getLevelItems(5, allLevelItems); // level 5 items for level 4 children
    } else {
      nextLevelItemsForChildren = getLevelItems(currentLevel + 2, allLevelItems); // next level items for children
    }
  }

  return (
    <ExpandableNode
      key={item.id}
      item={item}
      isSelected={isSelected}
      isExpanded={isExpanded}
      hasChildren={hasChildren}
      onToggleExpansion={() => toggleLevelExpansion(childLevelKey)}
      onNodeClick={handleNodeClick}
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
          visuallySelectedNode={visuallySelectedNode}
          onVisualSelection={onVisualSelection}
        />
      )}
    </ExpandableNode>
  );
};
