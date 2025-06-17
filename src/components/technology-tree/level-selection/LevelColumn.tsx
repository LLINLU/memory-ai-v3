
import React from "react";
import { LevelColumnHeader } from "./components/LevelColumnHeader";
import { LevelColumnContent } from "./components/LevelColumnContent";
import { LevelColumnDialogs } from "./components/LevelColumnDialogs";
import { useLevelColumnState } from "./hooks/useLevelColumnState";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface LevelColumnProps {
  title: string;
  subtitle: string;
  items: LevelItem[];
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
  onEditNode?: (
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  onDeleteNode?: (nodeId: string) => void;
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  nextLevelItems?: Record<string, LevelItem[]>;
  isLastLevel?: boolean;
  onGuidanceClick?: (type: string) => void;
}

export const LevelColumn: React.FC<LevelColumnProps> = ({
  title,
  subtitle,
  items,
  selectedId,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  selectedPath,
  nextLevelItems = {},
  isLastLevel = false,
  onGuidanceClick,
}) => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingNode,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    showDescriptions,
    isAddDialogOpen,
    setIsAddDialogOpen,
    addTitle,
    setAddTitle,
    addDescription,
    setAddDescription,
    openEditDialog,
    openAddDialog,
    toggleDescriptions,
  } = useLevelColumnState();

  // Extract level number from title (e.g., "レベル1" -> 1, "レベル10" -> 10)
  const levelNumber = parseInt(title.replace('レベル', ''), 10) || 1;

  const handleCustomNodeClick = () => {
    openAddDialog();
  };

  const handleAddSave = () => {
    if (addTitle.trim()) {
      // Create custom event to add node with the level information
      const addNodeEvent = new CustomEvent("add-node", {
        detail: {
          levelNumber: levelNumber.toString(),
          title: addTitle,
          description: addDescription,
        },
      });
      document.dispatchEvent(addNodeEvent);
    }
    setIsAddDialogOpen(false);
    setAddTitle("");
    setAddDescription("");
  };

  const handleEditClick = (e: React.MouseEvent, item: LevelItem) => {
    e.stopPropagation();
    openEditDialog(item);
  };

  const handleDeleteClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
  };

  const handleSaveEdit = () => {
    if (editingNode && onEditNode) {
      onEditNode(editingNode.id, {
        title: editTitle,
        description: editDescription,
      });
    }
    setIsEditDialogOpen(false);
  };

  // Create the combined title (e.g., "レベル1：目的")
  const combinedTitle = title && subtitle ? `${title}：${subtitle}` : title;

  // Determine if we should show the "追加する" button
  const shouldShowAddButton = () => {
    switch (levelNumber) {
      case 1:
        return true;
      case 2:
        return selectedPath.level1 !== "";
      case 3:
        return selectedPath.level2 !== "";
      case 4:
        return selectedPath.level3 !== "";
      case 5:
        return selectedPath.level4 !== "";
      case 6:
        return selectedPath.level5 !== "";
      case 7:
        return selectedPath.level6 !== "";
      case 8:
        return selectedPath.level7 !== "";
      case 9:
        return selectedPath.level8 !== "";
      case 10:
        return selectedPath.level9 !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-w-36 max-w-56 flex-shrink-0 bg-white p-4 rounded-lg relative">
      <LevelColumnHeader
        combinedTitle={combinedTitle}
        showDescriptions={showDescriptions}
        onToggleDescriptions={toggleDescriptions}
      />

      <LevelColumnContent
        items={items}
        selectedId={selectedId}
        onNodeClick={onNodeClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        levelNumber={levelNumber}
        showDescriptions={showDescriptions}
        shouldShowAddButton={shouldShowAddButton()}
        onCustomNodeClick={handleCustomNodeClick}
        nextLevelItems={nextLevelItems}
        isLastLevel={isLastLevel}
        onDeleteNode={onDeleteNode}
      />

      <LevelColumnDialogs
        isEditDialogOpen={isEditDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        editTitle={editTitle}
        editDescription={editDescription}
        onEditTitleChange={setEditTitle}
        onEditDescriptionChange={setEditDescription}
        onEditSave={handleSaveEdit}
        isAddDialogOpen={isAddDialogOpen}
        onAddDialogOpenChange={setIsAddDialogOpen}
        addTitle={addTitle}
        addDescription={addDescription}
        onAddTitleChange={setAddTitle}
        onAddDescriptionChange={setAddDescription}
        onAddSave={handleAddSave}
        onGuidanceClick={onGuidanceClick}
      />
    </div>
  );
};
