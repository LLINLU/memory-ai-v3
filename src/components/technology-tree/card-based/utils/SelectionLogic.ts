
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

export const isNodeSelected = (
  item: LevelItem,
  selectedPath: SelectedPath,
  scenarioId: string,
  currentLevel: number,
  allLevelItems: AllLevelItems
): boolean => {
  const currentLevelKey = levelNames2[currentLevel];
  const currentLevelSelection = selectedPath[currentLevelKey];
  
  // First check if this node is selected at the current level
  if (currentLevelSelection !== item.id) {
    return false;
  }
  
  // Only highlight if this is the deepest selected level
  const deepestSelectedLevel = getDeepestSelectedLevel(selectedPath);
  if (currentLevel !== deepestSelectedLevel) {
    return false;
  }
  
  // Validate that the full path is valid by checking parent selections
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
  
  return false;
};
