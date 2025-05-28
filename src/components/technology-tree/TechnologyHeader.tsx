
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ExplorationIcon } from '../icons/ExplorationIcon';

interface TechnologyHeaderProps {
  query?: string;
}

export const TechnologyHeader = ({ query: propQuery }: TechnologyHeaderProps) => {
  const location = useLocation();
  const stateQuery = location.state?.query;
  const stateScenario = location.state?.scenario;
  const searchMode = location.state?.searchMode || 'quick';
  
  // Use scenario if available, otherwise use query
  const displayQuery = stateScenario || stateQuery || propQuery || 'Dynamic technology tree based on your research context';

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        {searchMode === 'quick' ? (
          <span className="inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm text-blue-600 bg-white border border-blue-100">
            <ExplorationIcon className="mr-1 stroke-[2.5px]" />
            Quick Exploration
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm text-blue-600 bg-white border border-blue-100">
            <Search className="h-3 w-3 mr-1 stroke-[2.5px]" /> Deep Refiner
          </span>
        )}
      </div>
      <h1 className="text-[21px] font-bold text-gray-800">
        {displayQuery}
      </h1>
      <p className="text-gray-600 mt-2">
        下のノードをクリックして検索を絞り込み、結果を更新してください。Technology tree is dynamically generated based on your research context.
      </p>
    </div>
  );
};
