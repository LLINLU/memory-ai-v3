
import React from 'react';

interface ConnectionLinesProps {
  level1to2Line: {x1: number, y1: number, x2: number, y2: number} | null;
  level2to3Line: {x1: number, y1: number, x2: number, y2: number} | null;
  level3to4Line?: {x1: number, y1: number, x2: number, y2: number} | null;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  level1to2Line,
  level2to3Line,
  level3to4Line
}) => {
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      {level1to2Line && (
        <line
          x1={level1to2Line.x1}
          y1={level1to2Line.y1}
          x2={level1to2Line.x2}
          y2={level1to2Line.y2}
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      {level2to3Line && (
        <line
          x1={level2to3Line.x1}
          y1={level2to3Line.y1}
          x2={level2to3Line.x2}
          y2={level2to3Line.y2}
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      {level3to4Line && (
        <line
          x1={level3to4Line.x1}
          y1={level3to4Line.y1}
          x2={level3to4Line.x2}
          y2={level3to4Line.y2}
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};
