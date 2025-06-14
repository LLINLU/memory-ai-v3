import React, { useState } from "react";
import { TreeNode } from "./TreeNode";
import { EditNodeDialog } from "./EditNodeDialog";
import { AddNodeDialog } from "./AddNodeDialog";
import { CustomNodeButton } from "./CustomNodeButton";
import { EmptyNodeList } from "./EmptyNodeList";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<LevelItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDescriptions, setShowDescriptions] = useState(true);

  // Add dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");

  // Extract level number from title (e.g., "レベル1" -> 1, "レベル10" -> 10)
  const levelNumber = parseInt(title.replace('レベル', ''), 10) || 1;

  const handleCustomNodeClick = () => {
    // Open the add dialog instead of scrolling
    setAddTitle("");
    setAddDescription("");
    setIsAddDialogOpen(true);
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
    setEditingNode(item);
    setEditTitle(item.name);
    setEditDescription(item.description || "");
    setIsEditDialogOpen(true);
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

  const toggleDescriptions = () => {
    setShowDescriptions(!showDescriptions);
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

  // Define title color based on level
  const getTitleColor = () => {
    if (title === "レベル1") return "#3d5e80";
    if (title === "レベル2") return "#3774c2";
    if (title === "レベル3") return "#467efd";
    return "text-blue-700";
  };

  // Dynamic tooltip text based on showDescriptions state
  const getTooltipText = () => {
    return showDescriptions
      ? "クリックすると、ツリーマップの簡潔なビューが表示されます。"
      : "クリックすると、ツリーマップの詳細ビューが表示されます。";
  };

  // Function to get sub-node count for a specific item
  const getSubNodeCount = (itemId: string): number => {
    if (isLastLevel || !nextLevelItems[itemId]) {
      return 0;
    }
    return nextLevelItems[itemId].length;
  };

  return (
    <div className="min-w-36 max-w-56 flex-shrink-0 bg-white p-4 rounded-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base"
          style={{
            color: getTitleColor(),
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {combinedTitle}
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleDescriptions}
                className="focus:outline-none"
                aria-label={
                  showDescriptions ? "Hide descriptions" : "Show descriptions"
                }
              >
                {showDescriptions ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M12.1406 7C12.1406 7.08702 12.1061 7.17048 12.0445 7.23202C11.983 7.29356 11.8995 7.32812 11.8125 7.32812H2.1875C2.10048 7.32812 2.01702 7.29356 1.95548 7.23202C1.89395 7.17048 1.85938 7.08702 1.85938 7C1.85938 6.91298 1.89395 6.82952 1.95548 6.76798C2.01702 6.70645 2.10048 6.67188 2.1875 6.67188H11.8125C11.8995 6.67188 11.983 6.70645 12.0445 6.76798C12.1061 6.82952 12.1406 6.91298 12.1406 7ZM6.76813 5.48187C6.82965 5.54332 6.91305 5.57784 7 5.57784C7.08695 5.57784 7.17035 5.54332 7.23188 5.48187L8.98188 3.73187C9.03984 3.66967 9.07139 3.5874 9.06989 3.5024C9.06839 3.41739 9.03395 3.33628 8.97383 3.27617C8.91372 3.21605 8.83261 3.18161 8.7476 3.18011C8.6626 3.17861 8.58033 3.21016 8.51812 3.26812L7.32812 4.45758V0.875C7.32812 0.787976 7.29356 0.704516 7.23202 0.642981C7.17048 0.581445 7.08702 0.546875 7 0.546875C6.91298 0.546875 6.82952 0.581445 6.76798 0.642981C6.70645 0.704516 6.67188 0.787976 6.67188 0.875V4.45758L5.48187 3.26812C5.41967 3.21016 5.3374 3.17861 5.2524 3.18011C5.16739 3.18161 5.08628 3.21605 5.02617 3.27617C4.96605 3.33628 4.93161 3.41739 4.93011 3.5024C4.92861 3.5874 4.96017 3.66967 5.01813 3.73187L6.76813 5.48187ZM7.23188 8.51812C7.17035 8.45668 7.08695 8.42216 7 8.42216C6.91305 8.42216 6.82965 8.45668 6.76813 8.51812L5.01813 10.2681C4.96017 10.3303 4.92861 10.4126 4.93011 10.4976C4.93161 10.5826 4.96605 10.6637 5.02617 10.7238C5.08628 10.784 5.16739 10.8184 5.2524 10.8199C5.3374 10.8214 5.41967 10.7898 5.48187 10.7319L6.67188 9.54242V13.125C6.67188 13.212 6.70645 13.2955 6.76798 13.357C6.82952 13.4186 6.91298 13.4531 7 13.4531C7.08702 13.4531 7.17048 13.4186 7.23202 13.357C7.29356 13.2955 7.32812 13.212 7.32812 13.125V9.54242L8.51812 10.7319C8.58033 10.7898 8.6626 10.8214 8.7476 10.8199C8.83261 10.8184 8.91372 10.784 8.97383 10.7238C9.03395 10.6637 9.06839 10.5826 9.06989 10.4976C9.07139 10.4126 9.03984 10.3303 8.98188 10.2681L7.23188 8.51812Z"
                      fill="#8F8F8F"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M12.1406 7.0002C12.1406 7.08722 12.1061 7.17068 12.0445 7.23222C11.983 7.29376 11.8995 7.32833 11.8125 7.32833H2.1875C2.10048 7.32833 2.01702 7.29376 1.95548 7.23222C1.89395 7.17068 1.85938 7.08722 1.85938 7.0002ZM5.48187 2.85707L6.67188 1.66762V5.2502C6.67188 5.33722 6.70645 5.42068 6.76798 5.48222C6.82952 5.54375 6.91298 5.57832 7 5.57832C7.08702 5.57832 7.17048 5.54375 7.23202 5.48222C7.29356 5.42068 7.32812 5.33722 7.32812 5.2502V1.66762L8.51812 2.85707C8.58033 2.91503 8.6626 2.94659 8.7476 2.94509C8.83261 2.94359 8.91372 2.90915 8.97383 2.84903C9.03395 2.78892 9.06839 2.70781 9.06989 2.6228C9.07139 2.5378 9.03984 2.45553 8.98188 2.39332L7.23188 0.643325C7.17035 0.581877 7.08695 0.547363 7 0.547363C6.91305 0.547363 6.82965 0.581877 6.76813 0.643325L5.01813 2.39332C4.96017 2.45553 4.92861 2.5378 4.93011 2.6228C4.93161 2.70781 4.96605 2.78892 5.02617 2.84903C5.08628 2.90915 5.16739 2.94359 5.2524 2.94509C5.3374 2.94659 5.41967 2.91503 5.48187 2.85707ZM8.51812 11.1433L7.32812 12.3328V8.7502C7.32812 8.66318 7.29356 8.57972 7.23202 8.51818C7.17048 8.45665 7.08695 8.42208 7 8.42208C6.91298 8.42208 6.82952 8.45665 6.76798 8.51818C6.70645 8.57972 6.67188 8.66318 6.67188 8.7502V12.3328L5.48187 11.1433C5.41967 11.0854 5.3374 11.0538 5.2524 11.0553C5.16739 11.0568 5.08628 11.0912 5.02617 11.1514C4.96605 11.2115 4.93161 11.2926 4.93011 11.3776C4.92861 11.4626 4.96017 11.5449 5.01813 11.6071L6.76813 13.3571C6.82965 13.4185 6.91305 13.453 7 13.453C7.08702 13.453 7.17035 13.4185 7.23188 13.3571L8.98188 11.6071C9.03984 11.5449 9.07139 11.4626 9.06989 11.3776C9.06839 11.2926 9.03395 11.2115 8.97383 11.1514C8.91372 11.0912 8.83261 11.0568 8.7476 11.0553C8.6626 11.0538 8.58033 11.0854 8.51812 11.1433Z"
                      fill="#8F8F8F"
                    />
                  </svg>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>      <div className="space-y-4">
        {items.map((item, index) => (
          <TreeNode
            key={`${item.id}-${item.children_count || 0}-${index}`}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onNodeClick(item.id)}
            onEditClick={(e) => handleEditClick(e, item)}
            onDeleteClick={(e) => handleDeleteClick(e, item.id)}
            level={levelNumber}
            showDescription={showDescriptions}
            subNodeCount={getSubNodeCount(item.id)}
            isLastLevel={isLastLevel}
          />
        ))}

        {shouldShowAddButton() && (
          <CustomNodeButton onClick={handleCustomNodeClick} />
        )}

        {items.length === 0 && <EmptyNodeList level={levelNumber} />}
      </div>

      <EditNodeDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={editTitle}
        description={editDescription}
        onTitleChange={setEditTitle}
        onDescriptionChange={setEditDescription}
        onSave={handleSaveEdit}
      />

      <AddNodeDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={addTitle}
        description={addDescription}
        onTitleChange={setAddTitle}
        onDescriptionChange={setAddDescription}
        onSave={handleAddSave}
        onGuidanceClick={onGuidanceClick}
      />
    </div>
  );
};
