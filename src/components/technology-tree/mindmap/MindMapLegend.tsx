
import React from 'react';
import { getLevelColor } from '@/components/technology-tree/utils/levelColors';

interface MindMapLegendProps {
  treeMode?: string;
}

const MindMapLegendComponent: React.FC<MindMapLegendProps> = ({
  treeMode,
}) => {
  // Define static legend labels based on framework
  const getLegendLabels = () => {
    if (treeMode === "FAST") {
      return [
        { level: 1, label: 'How1' },
        { level: 2, label: 'How2' },
        { level: 3, label: 'How3' },
        { level: 4, label: 'How4' },
        { level: 5, label: 'How5' },
      ];
    } else {
      // Default to TED framework
      return [
        { level: 1, label: 'シナリオ' },
        { level: 2, label: '目的' },
        { level: 3, label: '機能' },
        { level: 4, label: '手段' },
        { level: 5, label: '手段2' },
      ];
    }
  };

  const legendItems = getLegendLabels();

  return (
    <div className="fixed bottom-4 left-4 z-[9999] pointer-events-none">
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 min-w-[200px] pointer-events-auto">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Legend
        </div>
        <div className="space-y-2">
          {legendItems.map(({ level, label }) => {
            const { bg } = getLevelColor(level);
            
            return (
              <div key={level} className="flex items-center gap-2 text-sm">
                <div 
                  className={`w-3 h-3 rounded-full ${bg} border border-gray-400 flex-shrink-0`}
                />
                <span className="text-gray-800 font-medium">
                  レベル{level}: {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const MindMapLegend = React.memo(MindMapLegendComponent);
