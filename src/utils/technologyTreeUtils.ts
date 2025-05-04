
export const getLevelNames = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes('optics')) {
    return {
      level1: "Purpose (Why)",
      level2: "Function (What)",
      level3: "Measure/Technology (How)"
    };
  } else if (selectedPath.level1.includes('medical')) {
    return {
      level1: "Purpose (Why)",
      level2: "Function (What)",
      level3: "Measure/Technology (How)"
    };
  }
  return {
    level1: "Purpose (Why)",
    level2: "Function (What)",
    level3: "Measure/Technology (How)"
  };
};
