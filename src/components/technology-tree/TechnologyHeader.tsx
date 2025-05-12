
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
  const searchMode = location.state?.searchMode || 'quick';
  const displayQuery = stateQuery || propQuery || 'アダプティブオプティクス技術の高度化を 研究者や技術者が天文学のユーザーに対して 天文台で実施し、精密な波面補正技術によって大気のゆらぎや光学的な歪みなどの状況に対応するものです。他の方法と比較しては、高精度かつ複数分野に応用可能な技術基盤に位置づけられます。';

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        {searchMode === 'quick' ? (
          <span className="inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm text-blue-600 bg-white border border-blue-100">
            <ExplorationIcon className="mr-1" />
            Quick Exploration
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm text-blue-600 bg-white border border-blue-100">
            <Search className="h-3 w-3 mr-1" /> Deep Search
          </span>
        )}
      </div>
      <h1 className="text-[21px] font-bold text-gray-800">
        {displayQuery}
      </h1>
      <p className="text-gray-600 mt-2">
        下のノードをクリックして検索を絞り込み、結果を更新してください。
      </p>
    </div>
  );
};
