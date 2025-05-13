
import React, { useRef, useEffect, useState } from 'react';
import { NodeActions } from './node-components/NodeActions';
import { NodeContent } from './node-components/NodeContent';
import { getNodeStyle } from './node-utils/nodeStyles';
import { TreeNode as TreeNodeType } from '@/types/tree';

interface TreeNodeProps {
  item: TreeNodeType;
  isSelected: boolean;
  onClick: () => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  isSelected,
  onClick,
  onEditClick,
  onDeleteClick
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

  const nodeStyleClass = getNodeStyle(item, isSelected);

  return (
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
      <div className="flex flex-col">
        <NodeContent item={item} isSelected={isSelected} isHovered={isHovered} />
        
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
};
