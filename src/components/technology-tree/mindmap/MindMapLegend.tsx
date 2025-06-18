
import React from 'react';
import { getLevelColor } from '@/components/technology-tree/utils/levelColors';

interface MindMapLegendProps {
  levelNames: Record<string, string>;
}

export const MindMapLegend: React.FC<MindMapLegendProps> = ({
  levelNames,
}) => {
  // Debug logging to see what data we're receiving
  console.log('MindMapLegend: levelNames received:', levelNames);
  
  // Show first 5 levels in the legend
  const levelsToShow = [1, 2, 3, 4, 5];
  
  // Fallback level names in case levelNames is empty or missing values
  const fallbackLevelNames: Record<string, string> = {
    level1: 'シナリオ',
    level2: '目的',
    level3: '機能',
    level4: '手段',
    level5: '手段2'
  };

  // Count how many levels will actually render
  const visibleLevels = levelsToShow.filter(level => {
    const levelKey = `level${level}` as keyof typeof levelNames;
    const levelName = levelNames[levelKey] || fallbackLevelNames[levelKey];
    return levelName;
  });

  console.log('MindMapLegend: visibleLevels count:', visibleLevels.length);

  // Always show at least one test item if no data is available
  const shouldShowTestItem = visibleLevels.length === 0;

  return (
    <div className="absolute bottom-4 left-4 z-50">
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 min-w-[200px]">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Legend
        </div>
        <div className="space-y-2">
          {shouldShowTestItem ? (
            // Test item to confirm component is rendering
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-gray-400" />
              <span className="text-gray-700 font-medium">
                Legend Loading...
              </span>
            </div>
          ) : (
            levelsToShow.map((level) => {
              const levelKey = `level${level}` as keyof typeof levelNames;
              const levelName = levelNames[levelKey] || fallbackLevelNames[levelKey];
              
              if (!levelName) {
                console.log(`MindMapLegend: No name found for ${levelKey}`);
                return null;
              }
              
              const { bg } = getLevelColor(level);
              
              return (
                <div key={level} className="flex items-center gap-2 text-sm">
                  <div 
                    className={`w-3 h-3 rounded-full ${bg} border border-gray-400 flex-shrink-0`}
                  />
                  <span className="text-gray-800 font-medium">
                    レベル{level}: {levelName}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
