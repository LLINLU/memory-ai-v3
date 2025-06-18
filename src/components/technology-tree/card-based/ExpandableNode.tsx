
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

  // Define width constraints based on level
  const getNodeWidthClass = (level: number) => {
    switch (level) {
      case 1: return 'w-full'; // Level 1 nodes use full width
      case 2: return 'max-w-5xl'; // Level 2 narrower than level 1
      case 3: return 'max-w-4xl'; // Level 3 narrower than level 2
      case 4: return 'max-w-3xl'; // Level 4 narrower than level 3
      default: return 'max-w-2xl'; // Level 5+ progressively narrower
    }
  };

  return (
    <div className={`w-full ${getNodeWidthClass(level)}`}>
      <div className="flex items-center gap-2">
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
        
        <div className="flex-1">
          <TreeNode
            item={item}
            isSelected={isSelected}
            onClick={onNodeClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            level={level}
            showDescription={true}
            subNodeCount={0}
            isLastLevel={!hasChildren}
          />
        </div>
      </div>
      
      {isExpanded && children && (
        <div className="ml-6 mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};
