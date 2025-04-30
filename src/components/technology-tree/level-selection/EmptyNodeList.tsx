
import React from 'react';

interface EmptyNodeListProps {
  levelTitle: string;
}

export const EmptyNodeList: React.FC<EmptyNodeListProps> = ({ levelTitle }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {levelTitle === "Level 2" ? "Select a domain from Level 1" : "Select a sub-domain from Level 2"}
    </div>
  );
};
