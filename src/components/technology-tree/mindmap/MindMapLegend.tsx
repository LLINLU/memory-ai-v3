
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getLevelColor } from '@/components/technology-tree/utils/levelColors';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MindMapLegendProps {
  treeMode?: string;
}

const MindMapLegendComponent: React.FC<MindMapLegendProps> = ({
  treeMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

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
    <div className="absolute bottom-4 left-4 z-[50]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Legend
              </span>
              {isOpen ? (
                <ChevronUp className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              )}
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-3 pb-3 pt-0 space-y-2 min-w-[200px]">
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
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const MindMapLegend = React.memo(MindMapLegendComponent);
