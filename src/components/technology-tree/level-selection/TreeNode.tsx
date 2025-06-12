
import React, { useRef, useEffect, useState } from 'react';
import { NodeActions } from './node-components/NodeActions';
import { NodeContent } from './node-components/NodeContent';
import { getNodeStyle } from './node-utils/nodeStyles';
import { TreeNode as TreeNodeType } from '@/types/tree';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TreeNodeProps {
  item: TreeNodeType;
  isSelected: boolean;
  onClick: () => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  level?: number;
  showDescription?: boolean;
  subNodeCount?: number;
  isLastLevel?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  isSelected,
  onClick,
  onEditClick,
  onDeleteClick,
  level,
  showDescription = false,
  subNodeCount = 0,
  isLastLevel = false,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeWidth, setNodeWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Update width on mount and window resize
    const updateWidth = () => {
      if (nodeRef.current) {
        setNodeWidth(nodeRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const nodeStyleClass = getNodeStyle(item, isSelected, level);
  // Force white text for selected nodes to ensure visibility
  const descriptionTextColor = isSelected ? "text-gray-100" : "text-gray-600";

  // Determine if tooltip should be shown
  const shouldShowTooltip = !isSelected && !isLastLevel && subNodeCount > 0;

  const nodeContent = (
    <div
      ref={nodeRef}
      className={`
        py-4 px-4 rounded-lg cursor-pointer transition-all relative
        ${nodeStyleClass}
        group
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col relative z-10">
        <NodeContent 
          item={item} 
          isSelected={isSelected} 
          isHovered={isHovered && !showDescription} 
          level={level} 
        />
        
        {/* Show description when showDescription is true */}
        {showDescription && item.description && (
          <div className={`mt-3 text-sm ${descriptionTextColor} border-t pt-2 border-gray-100`}>
            {item.description}
          </div>
        )}
        
        {/* Show actions when hovered */}
        {isHovered && (
          <div className="mt-2 flex justify-end">
            <NodeActions 
              itemName={item.name} 
              onEditClick={onEditClick} 
              onDeleteClick={onDeleteClick} 
            />
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with tooltip if conditions are met
  if (shouldShowTooltip) {
    return (
      <TooltipProvider delayDuration={50} skipDelayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            {nodeContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>サブカテゴリが{subNodeCount}つあります。クリックで表示。</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return nodeContent;
};
