
import React from 'react';
import { ConnectionLines } from "./ConnectionLines";

interface LevelConnectionLinesProps {
  level1to2Line: {x1: number, y1: number, x2: number, y2: number} | null;
  level2to3Line: {x1: number, y1: number, x2: number, y2: number} | null;
  level3to4Line?: {x1: number, y1: number, x2: number, y2: number} | null;
}

export const LevelConnectionLines: React.FC<LevelConnectionLinesProps> = ({
  level1to2Line,
  level2to3Line,
  level3to4Line
}) => {
  return (
    <ConnectionLines
      level1to2Line={level1to2Line}
      level2to3Line={level2to3Line}
      level3to4Line={level3to4Line}
    />
  );
};
