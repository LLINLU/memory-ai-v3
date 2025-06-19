
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
  onAddClick?: (e: React.MouseEvent, nodeId: string) => void;
  onAiAssistClick?: (e: React.MouseEvent, nodeId: string) => void;
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
}) => {
  return (
    <div className="space-y-2 mt-4">
      {items.length === 0 ? (
        <EmptyNodeList levelNumber={levelNumber} />
      ) : (
        items.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onNodeClick(item.id)}
            onEditClick={(e) => onEditClick(e, item)}
            onDeleteClick={(e) => onDeleteClick(e, item.id)}
            onAddClick={onAddClick ? (e) => onAddClick(e, item.id) : undefined}
            onAiAssistClick={onAiAssistClick ? (e) => onAiAssistClick(e, item.id) : undefined}
            level={levelNumber}
            showDescription={showDescriptions}
            subNodeCount={item.children_count || nextLevelItems[item.id]?.length || 0}
            isLastLevel={isLastLevel}
          />
        ))
      )}

      {shouldShowAddButton && (
        <CustomNodeButton onClick={onCustomNodeClick} />
      )}
    </div>
  );
};
