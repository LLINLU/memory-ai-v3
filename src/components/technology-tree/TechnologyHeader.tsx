
import React from 'react';
import { useLocation } from 'react-router-dom';

interface TechnologyHeaderProps {
  query?: string;
}

export const TechnologyHeader = ({ query: propQuery }: TechnologyHeaderProps) => {
  const location = useLocation();
  const stateQuery = location.state?.query;
  const displayQuery = stateQuery || propQuery || '補償光学の眼科分野への利用';

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h1 className="text-[21px] font-bold text-gray-800">
        {displayQuery}
      </h1>
      <p className="text-gray-600 mt-2">
        Click on nodes below to refine your search and update results.
      </p>
    </div>
  );
};
