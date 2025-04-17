
import React from 'react';

interface TechnologyHeaderProps {
  query?: string;
}

export const TechnologyHeader = ({ query }: TechnologyHeaderProps) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Technology Tree</h1>
      <p className="text-gray-600 mt-2">
        {query || 'Navigate through the hierarchy: Level 1 → Level 2 → Level 3'}
      </p>
    </div>
  );
};
