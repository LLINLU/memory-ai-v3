
import React from 'react';

interface TechnologyHeaderProps {
  query?: string;
}

export const TechnologyHeader = ({ query = '補償光学の眼科分野への利用' }: TechnologyHeaderProps) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h1 className="text-[21px] font-bold text-gray-800">
        {query}
      </h1>
      <p className="text-gray-600 mt-2">
        Your query mapped to this technology path - explore or refine to see relevant results
      </p>
    </div>
  );
};
