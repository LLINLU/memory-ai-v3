
export const getLevelNames = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes('optics')) {
    return {
      level1: "Purpose",
      level2: "Function",
      level3: "Measure/Technology"
    };
  } else if (selectedPath.level1.includes('medical')) {
    return {
      level1: "Purpose",
      level2: "Function",
      level3: "Measure/Technology"
    };
  }
  return {
    level1: "Purpose",
    level2: "Function",
    level3: "Measure/Technology"
  };
};
