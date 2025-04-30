
import React, { useState } from 'react';
import { TreeNode } from './TreeNode';
import { EditNodeDialog } from './EditNodeDialog';
import { CustomNodeButton } from './CustomNodeButton';
import { EmptyNodeList } from './EmptyNodeList';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
}

interface LevelColumnProps {
  title: string;
  subtitle: string;
  items: LevelItem[];
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
  onEditNode?: (nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export const LevelColumn: React.FC<LevelColumnProps> = ({
  title,
  subtitle,
  items,
  selectedId,
  onNodeClick,
  onEditNode,
  onDeleteNode
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<LevelItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const handleCustomNodeClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Extract the level number from the title (e.g., "Level 1" -> "1")
    const levelNumber = title.slice(-1);
    
    // Update sidebar tab to chat with level-specific message
    const customEvent = new CustomEvent('switch-to-chat', {
      detail: {
        message: `👋 Hi there!\nReady to add a new node under Level ${levelNumber}? Here's how you can start:\n🔹 Option 1: Enter a clear Title and Description yourself.\n🔹 Option 2: Just describe your idea in natural language — I'll help turn it into a well-structured node!`
      }
    });
    document.dispatchEvent(customEvent);
  };

  const handleEditClick = (e: React.MouseEvent, item: LevelItem) => {
    e.stopPropagation(); // Prevent triggering node selection
    setEditingNode(item);
    setEditTitle(item.name);
    setEditDescription(item.description || "");
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Prevent triggering node selection
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
  };

  const handleSaveEdit = () => {
    if (editingNode && onEditNode) {
      onEditNode(editingNode.id, {
        title: editTitle,
        description: editDescription
      });
    }
    setIsEditDialogOpen(false);
  };

  return (
    <div className="w-1/3 bg-white p-4 rounded-lg relative">
      <h2 className="text-base font-semibold text-blue-700 mb-3">{title}</h2>
      <h3 className="text-sm text-gray-500 mb-4">{subtitle}</h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onNodeClick(item.id)}
            onEditClick={(e) => handleEditClick(e, item)}
            onDeleteClick={(e) => handleDeleteClick(e, item.id)}
          />
        ))}

        <CustomNodeButton onClick={handleCustomNodeClick} />

        {items.length === 0 && <EmptyNodeList levelTitle={title} />}
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
    </div>
  );
};
