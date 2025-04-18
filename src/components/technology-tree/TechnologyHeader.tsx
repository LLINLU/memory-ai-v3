
import React from 'react';

interface TechnologyHeaderProps {
  query?: string;
}

export const TechnologyHeader = ({ query }: TechnologyHeaderProps) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h1 className="text-[21px] font-bold text-gray-800">Technology Tree</h1>
      <p className="text-gray-600 mt-2">
        {query || 'Select technologies by exploring the tree'}
      </p>
    </div>
  );
};
