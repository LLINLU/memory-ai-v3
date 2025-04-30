
import React, { useRef, useState } from 'react';
import { NodeContent } from './tree-node/NodeContent';
import { NodeActions } from './tree-node/NodeActions';
import { useNodeWidth } from './tree-node/useNodeWidth';
import { getNodeBackgroundClass } from './tree-node/nodeStyles';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
}

interface TreeNodeProps {
  item: LevelItem;
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
  const [isHovered, setIsHovered] = useState(false);
  const nodeWidth = useNodeWidth(nodeRef);

  const buttonPositionClass = nodeWidth > 250 ? "absolute top-4 right-2" : "mt-2 flex justify-end";
  const backgroundClass = getNodeBackgroundClass({ isSelected, isCustom: item.isCustom });

  return (
    <div
      ref={nodeRef}
      className={`
        py-4 px-4 rounded-lg cursor-pointer transition-all relative
        ${backgroundClass}
        group
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <NodeContent 
          name={item.name}
          info={item.info}
          description={item.description}
          isSelected={isSelected}
          isHovered={isHovered}
        />
        
        {isHovered && nodeWidth > 250 && (
          <NodeActions 
            itemName={item.name}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )}
      </div>
      
      {/* Only show buttons below if width is smaller than 250px and node is hovered */}
      {isHovered && nodeWidth <= 250 && (
        <div className={buttonPositionClass}>
          <NodeActions 
            itemName={item.name}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      )}
    </div>
  );
};
