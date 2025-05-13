
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
  
  // Determine level number based on title
  const levelNumber = title === "レベル1" ? 1 : 
                      title === "レベル2" ? 2 : 
                      title === "レベル3" ? 3 : 
                      undefined;
  
  const handleCustomNodeClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Extract the level number from the title (e.g., "レベル1" -> "1")
    // Updated to handle Japanese title format
    const levelNumber = title === "レベル1" ? "1" : 
                        title === "レベル2" ? "2" : 
                        title === "レベル3" ? "3" : 
                        title.slice(-1);
    
    // Update sidebar tab to chat with level-specific message
    const customEvent = new CustomEvent('switch-to-chat', {
      detail: {
        message: `👋 こんにちは！レベル${levelNumber}の下に新しいノードを追加する準備はできていますか？始め方は次のとおりです：
🔹 オプション1：タイトルと説明を自分ではっきりと入力してください。
🔹 オプション2：自然な言葉であなたのアイデアを説明するだけでいいです — 私がそれを適切に構造化されたノードに変換するお手伝いをします！`
      }
    });
    document.dispatchEvent(customEvent);
    
    // Find and open the chatbox
    const chatbox = document.querySelector('[data-chatbox]');
    if (chatbox) {
      chatbox.setAttribute('data-chatbox-open', 'true');
    }
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

  // Create the combined title (e.g., "レベル1：目的")
  const combinedTitle = title && subtitle ? `${title}：${subtitle}` : title;
  
  // Define title color based on level
  const getTitleColor = () => {
    if (title === "レベル1") return "#3d5e80";
    if (title === "レベル2") return "#3774c2";
    if (title === "レベル3") return "#467efd";
    return "text-blue-700"; // default color
  };

  return (
    <div className="w-1/3 bg-white p-4 rounded-lg relative">
      <h2 
        className="text-base mb-4"
        style={{ 
          color: getTitleColor(), 
          fontSize: '14px', 
          fontWeight: 400 
        }}
      >
        {combinedTitle}
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onNodeClick(item.id)}
            onEditClick={(e) => handleEditClick(e, item)}
            onDeleteClick={(e) => handleDeleteClick(e, item.id)}
            level={levelNumber}
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
