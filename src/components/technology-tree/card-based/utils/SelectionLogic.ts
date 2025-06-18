interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface SelectedPath {
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
}

interface AllLevelItems {
  level3Items: Record<string, LevelItem[]>;
  level4Items: Record<string, LevelItem[]>;
  level5Items: Record<string, LevelItem[]>;
  level6Items: Record<string, LevelItem[]>;
  level7Items: Record<string, LevelItem[]>;
  level8Items: Record<string, LevelItem[]>;
  level9Items: Record<string, LevelItem[]>;
  level10Items: Record<string, LevelItem[]>;
}

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

export const getDeepestSelectedLevel = (selectedPath: SelectedPath): number => {
  // Start from level 10 and work backwards to find the deepest selection
  for (let level = 10; level >= 1; level--) {
    const levelKey = `level${level}` as keyof typeof selectedPath;
    if (selectedPath[levelKey]) {
      return level;
    }
  }
  return 1; // Default to level 1 if nothing is selected
};

// NEW: Simple visual selection function - independent from path logic
export const isNodeVisuallySelected = (
  nodeId: string,
  level: number,
  visuallySelectedNode: { level: number; nodeId: string } | null
): boolean => {
  return visuallySelectedNode?.level === level && visuallySelectedNode?.nodeId === nodeId;
};

// Keep the existing path-based selection logic for navigation/logic purposes
export const isNodeSelected = (
  item: LevelItem,
  selectedPath: SelectedPath,
  scenarioId: string,
  currentLevel: number,
  allLevelItems: AllLevelItems
): boolean => {
  const currentLevelKey = levelNames2[currentLevel];
  const currentLevelSelection = selectedPath[currentLevelKey];
  
  console.log(`SelectionLogic: Checking selection for item ${item.id} at level ${currentLevel}`, {
    currentLevelSelection,
    itemId: item.id,
    selectedPath,
    scenarioId
  });
  
  // Only check if this specific node is selected at its level
  if (currentLevelSelection !== item.id) {
    return false;
  }
  
  // Validate that the path is valid by checking parent selections
  switch (currentLevel) {
    case 1:
      // Level 1 nodes (scenarios) are always valid if selected
      return true;
      
    case 2:
      // Level 2 nodes must have valid level 1 selection (scenarioId)
      return selectedPath.level1 === scenarioId;
      
    case 3:
      // Level 3 nodes must have valid level 1 and level 2 selections
      if (selectedPath.level1 !== scenarioId || !selectedPath.level2) {
        return false;
      }
      // Check if this level 3 item exists under the selected level 2 item
      const level2Items = allLevelItems.level3Items[selectedPath.level2] || [];
      return level2Items.some(l3Item => l3Item.id === item.id);
      
    case 4:
      // Level 4 nodes must have valid level 1, 2, and 3 selections
      if (selectedPath.level1 !== scenarioId || !selectedPath.level2 || !selectedPath.level3) {
        return false;
      }
      // Check if this level 4 item exists under the selected level 3 item
      const level3Items = allLevelItems.level4Items[selectedPath.level3] || [];
      return level3Items.some(l4Item => l4Item.id === item.id);
      
    default:
      // For levels 5 and above, validate all parent levels are selected
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
      
      const parentLevelItems = getLevelItems(currentLevel);
      const currentLevelItems = parentLevelItems[parentId] || [];
      return currentLevelItems.some(item_check => item_check.id === item.id);
  }
};
