
import React from 'react';
import { TreeNode } from "@/types/tree";
import { getTextColor } from "../node-utils/nodeStyles";

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
  const textColorClass = getTextColor(item, isSelected, level);
  
  return (
    <div className="flex flex-col w-full">
      <h4 className="text-base leading-6 font-medium">{item.name}</h4>
      
      {item.info && (
        <p className={`text-xs mt-1 ${textColorClass}`}>{item.info}</p>
      )}
      
      {/* Only display description when hovered and not already shown by parent */}
      {isHovered && item.description && (
        <p className={`mt-3 text-sm ${textColorClass}`}>{item.description}</p>
      )}
    </div>
  );
};
