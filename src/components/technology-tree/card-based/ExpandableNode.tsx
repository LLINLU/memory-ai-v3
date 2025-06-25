
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { TreeNode } from '../level-selection/TreeNode';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface ExpandableNodeProps {
  item: LevelItem;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleExpansion: () => void;
  onNodeClick: () => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  level: number;
  children?: React.ReactNode;
}

export const ExpandableNode: React.FC<ExpandableNodeProps> = ({
  item,
  isSelected,
  isExpanded,
  hasChildren,
  onToggleExpansion,
  onNodeClick,
  onEditClick,
  onDeleteClick,
  level,
  children,
}) => {
  const handleExpansionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpansion();
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add functionality for card-based view
  };

  const handleAiAssistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement AI assist functionality for card-based view
  };

  // Get progressive width constraints for the node content
  const getNodeWidthClass = () => {
    switch (level) {
      case 2:
        return "max-w-[95%]";
      case 3:
        return "max-w-[90%]";
      case 4:
        return "max-w-[85%]";
      case 5:
        return "max-w-[80%]";
      case 6:
        return "max-w-[75%]";
      case 7:
        return "max-w-[70%]";
      case 8:
        return "max-w-[65%]";
      case 9:
        return "max-w-[60%]";
      case 10:
        return "max-w-[55%]";
      default:
        return "w-full";
    }
  };

  return (
    <div className="w-full">
      <div className={`flex items-center gap-2 ${getNodeWidthClass()}`}>
        {hasChildren && (
          <button
            onClick={handleExpansionClick}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        
        <div className="flex-1 min-w-0">
          <TreeNode
            item={item}
            isSelected={isSelected}
            onClick={onNodeClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onAddClick={handleAddClick}
            onAiAssistClick={handleAiAssistClick}
            level={level}
            showDescription={true}
            subNodeCount={0}
            isLastLevel={!hasChildren}
          />
        </div>
      </div>
      
      {isExpanded && children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};
