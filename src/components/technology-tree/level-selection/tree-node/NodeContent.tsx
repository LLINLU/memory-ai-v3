
import React from 'react';

interface NodeContentProps {
  name: string;
  info?: string;
  description?: string;
  isSelected: boolean;
  isHovered: boolean;
}

export const NodeContent: React.FC<NodeContentProps> = ({
  name,
  info,
  description,
  isSelected,
  isHovered
}) => {
  return (
    <>
      <h4 className="text-lg font-medium">{name}</h4>
      
      {info && (
        <p className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-gray-600'}`}>{info}</p>
      )}
      
      {/* Only display description when hovered */}
      {isHovered && description && (
        <p className="mt-3 text-sm">{description}</p>
      )}
    </>
  );
};
