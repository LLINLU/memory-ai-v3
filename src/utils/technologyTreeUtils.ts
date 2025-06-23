export const getLevelNames = (mode: "TED" | "FAST" = "TED") => {
  if (mode === "FAST") {
    return {
      level1: "How1",
      level2: "How2",
      level3: "How3",
      level4: "How4",
      level5: "How5",
      level6: "How6",
      level7: "How7",
    };
  }

  // TED mode (default)
  return {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  };
};

// Legacy function for backwards compatibility
export const getLevelNamesFromPath = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes("optics")) {
    return {
      level1: "目的",
      level2: "機能",
      level3: "手段／技術",
    };
  } else if (selectedPath.level1.includes("medical")) {
    return {
      level1: "目的",
      level2: "機能",
      level3: "手段／技術",
    };
  }
  return {
    level1: "目的",
    level2: "機能",
    level3: "手段／技術",
  };
};
