
import React from 'react';
import { getLevelColor } from '@/components/technology-tree/utils/levelColors';

interface MindMapLegendProps {
  levelNames: Record<string, string>;
}

export const MindMapLegend: React.FC<MindMapLegendProps> = ({
  levelNames,
}) => {
  // Show first 5 levels in the legend
  const levelsToShow = [1, 2, 3, 4, 5];

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-3">
        <div className="space-y-2">
          {levelsToShow.map((level) => {
            const levelKey = `level${level}` as keyof typeof levelNames;
            const levelName = levelNames[levelKey];
            
            if (!levelName) return null;
            
            const { bg } = getLevelColor(level);
            
            return (
              <div key={level} className="flex items-center gap-2 text-sm">
                <div 
                  className={`w-3 h-3 rounded-full ${bg} border border-gray-300`}
                />
                <span className="text-gray-700 font-medium">
                  レベル{level}: {levelName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
