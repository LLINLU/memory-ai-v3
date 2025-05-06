
export const getLevelNames = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes('optics')) {
    return {
      level1: "目的",
      level2: "機能",
      level3: "手段／技術"
    };
  } else if (selectedPath.level1.includes('medical')) {
    return {
      level1: "目的",
      level2: "機能",
      level3: "手段／技術"
    };
  }
  return {
    level1: "目的",
    level2: "機能",
    level3: "手段／技術"
  };
};
