
import { useMemo } from "react";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
}

export const useLevelItemsReordering = (
  level1Items: LevelItem[],
  level2Items: Record<string, LevelItem[]>,
  level3Items: Record<string, LevelItem[]>,
  level4Items: Record<string, LevelItem[]>,
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  },
  showLevel4: boolean
) => {
  const reorderedLevel1Items = useMemo(() => {
    const items = [...level1Items];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level1);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level1Items, selectedPath.level1]);

  const visibleLevel2Items = useMemo(() => {
    if (!selectedPath.level1) return [];
    const items = [...(level2Items[selectedPath.level1] || [])];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level2);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level2Items, selectedPath]);

  const visibleLevel3Items = useMemo(() => {
    if (!selectedPath.level2) return [];
    const items = [...(level3Items[selectedPath.level2] || [])];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level3);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level3Items, selectedPath]);

  const visibleLevel4Items = useMemo(() => {
    if (!selectedPath.level3 || !showLevel4) return [];
    const items = [...(level4Items[selectedPath.level3] || [])];
    const selectedIndex = items.findIndex(item => item.id === selectedPath.level4);
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level4Items, selectedPath, showLevel4]);

  return {
    reorderedLevel1Items,
    visibleLevel2Items,
    visibleLevel3Items,
    visibleLevel4Items
  };
};
