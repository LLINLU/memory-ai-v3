
import React from "react";
import { TreeNode } from "../TreeNode";
import { CustomNodeButton } from "../CustomNodeButton";
import { EmptyNodeList } from "../EmptyNodeList";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface LevelColumnContentProps {
  items: LevelItem[];
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
  onEditClick: (e: React.MouseEvent, item: LevelItem) => void;
  onDeleteClick: (e: React.MouseEvent, nodeId: string) => void;
  onAddClick: (e: React.MouseEvent, item: LevelItem) => void;
  onAiAssistClick: (e: React.MouseEvent, item: LevelItem) => void;
  levelNumber: number;
  showDescriptions: boolean;
  shouldShowAddButton: boolean;
  onCustomNodeClick: () => void;
  nextLevelItems: Record<string, LevelItem[]>;
  isLastLevel: boolean;
  onDeleteNode?: (nodeId: string) => void;
}

export const LevelColumnContent: React.FC<LevelColumnContentProps> = ({
  items,
  selectedId,
  onNodeClick,
  onEditClick,
  onDeleteClick,
  onAddClick,
  onAiAssistClick,
  levelNumber,
  showDescriptions,
  shouldShowAddButton,
  onCustomNodeClick,
  nextLevelItems,
  isLastLevel,
  onDeleteNode,
}) => {
  const getSubNodeCount = (itemId: string): number => {
    if (isLastLevel || !nextLevelItems[itemId]) {
      return 0;
    }
    return nextLevelItems[itemId].length;
  };

  const handleDeleteClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <TreeNode
          key={`${item.id}-${item.children_count || 0}-${index}`}
          item={item}
          isSelected={selectedId === item.id}
          onClick={() => onNodeClick(item.id)}
          onEditClick={(e) => onEditClick(e, item)}
          onDeleteClick={(e) => handleDeleteClick(e, item.id)}
          onAddClick={(e) => onAddClick(e, item)}
          onAiAssistClick={(e) => onAiAssistClick(e, item)}
          level={levelNumber}
          showDescription={showDescriptions}
          subNodeCount={getSubNodeCount(item.id)}
          isLastLevel={isLastLevel}
        />
      ))}

      {shouldShowAddButton && (
        <CustomNodeButton onClick={onCustomNodeClick} />
      )}

      {items.length === 0 && <EmptyNodeList level={levelNumber} />}
    </div>
  );
};
