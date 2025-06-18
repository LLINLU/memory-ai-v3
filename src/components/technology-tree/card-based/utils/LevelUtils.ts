
interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
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

interface LevelNames {
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
}

export const getLevelLabel = (level: number, levelNames: LevelNames): string => {
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

export const getLevelItems = (level: number, allLevelItems: AllLevelItems): Record<string, LevelItem[]> => {
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

export const hasChildrenForNode = (
  item: LevelItem,
  nextLevelItems: Record<string, LevelItem[]>,
  currentLevel: number,
  allLevelItems: AllLevelItems
): boolean => {
  // Check if the node has children in the current nextLevelItems
  const directChildren = nextLevelItems[item.id]?.length > 0;
  
  // For level 3 nodes, also check if they have level 4 children in allLevelItems
  if (currentLevel === 3) {
    const level4Children = allLevelItems.level4Items[item.id]?.length > 0;
    return directChildren || level4Children;
  }
  
  // For other levels, check the appropriate level items
  if (currentLevel < 10) {
    const nextLevelItemsMap = getLevelItems(currentLevel + 1, allLevelItems);
    const nextLevelChildren = nextLevelItemsMap[item.id]?.length > 0;
    return directChildren || nextLevelChildren;
  }
  
  return directChildren;
};
