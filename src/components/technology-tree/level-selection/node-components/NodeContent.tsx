
import React from 'react';
import { TreeNode } from "@/types/tree";

interface NodeContentProps {
  item: TreeNode;
  isSelected: boolean;
  isHovered: boolean;
  level?: number;
}

export const NodeContent: React.FC<NodeContentProps> = ({ 
  item, 
  isSelected,
  isHovered,
  level
}) => {
  // Force white text for better contrast on blue backgrounds
  const textColorClass = isSelected ? "text-white" : "text-gray-800";
  const descriptionTextColor = isSelected ? "text-gray-100" : "text-gray-600";
  
  return (
    <div className="flex flex-col w-full">
      {/* Always show the title */}
      <h4 className={`text-base leading-6 font-medium ${textColorClass}`}>{item.name}</h4>
      
      {/* Always show info if it exists */}
      {item.info && (
        <p className={`text-xs mt-1 ${textColorClass}`}>{item.info}</p>
      )}
      
      {/* Only display description when hovered */}
      {isHovered && item.description && (
        <p className={`mt-3 text-sm ${descriptionTextColor}`}>{item.description}</p>
      )}
    </div>
  );
};
