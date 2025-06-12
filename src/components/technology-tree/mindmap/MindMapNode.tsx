
import React from "react";
import { MindMapNode } from "@/utils/mindMapDataTransform";

interface MindMapNodeProps {
  node: MindMapNode;
  onClick: (nodeId: string, level: number) => void;
  onEdit?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDelete?: (level: string, nodeId: string) => void;
}

export const MindMapNodeComponent: React.FC<MindMapNodeProps> = ({
  node,
  onClick,
  onEdit,
  onDelete,
}) => {
  const getNodeStyle = (node: MindMapNode) => {
    const isRoot = node.depth === 1; // First level after root
    const isSelected = node.isSelected;
    
    if (isRoot) {
      return {
        element: 'circle' as const,
        size: 40,
        className: `bg-red-500 border-2 ${isSelected ? 'border-gray-800' : 'border-transparent'} text-white`,
        textSize: 'text-sm font-semibold'
      };
    }
    
    // Check if it's a leaf node (no children in the tree)
    const isLeaf = !node.children || node.children.length === 0;
    
    return {
      element: 'rect' as const,
      width: isLeaf ? 180 : 160,
      height: isLeaf ? 70 : 65,
      className: `bg-transparent border-2 border-blue-500 ${
        isSelected ? 'border-blue-700 shadow-lg' : ''
      } ${isLeaf ? 'border-dashed' : ''} text-blue-600`,
      textSize: 'text-xs font-medium',
      borderRadius: isLeaf ? 'rounded-full' : 'rounded-lg'
    };
  };

  const handleClick = () => {
    onClick(node.id, node.level);
  };

  const style = getNodeStyle(node);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      style={{
        left: style.element === 'circle' ? node.x - style.size/2 : node.x - style.width/2,
        top: style.element === 'circle' ? node.y - style.size/2 : node.y - style.height/2,
        width: style.element === 'circle' ? style.size : style.width,
        height: style.element === 'circle' ? style.size : style.height,
      }}
      onClick={handleClick}
    >
      {style.element === 'circle' ? (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center ${style.className}`}
        >
          <span className={style.textSize}>{node.name}</span>
        </div>
      ) : (
        <div
          className={`w-full h-full ${style.borderRadius} p-3 flex flex-col justify-center ${style.className}`}
        >
          <div className="text-xs font-semibold mb-1 opacity-70">
            {node.levelName}
          </div>
          <div className={`${style.textSize} truncate`} title={node.name}>
            {node.name}
          </div>
          {node.description && (
            <div className="text-xs opacity-60 mt-1 line-clamp-2" title={node.description}>
              {node.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
