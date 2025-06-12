
import React from "react";
import { MindMapNode } from "@/utils/mindMapDataTransform";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const getLevelColor = (level: number) => {
    const colors = [
      "bg-slate-200 border-slate-400 text-slate-900", // Root node (level 0)
      "bg-blue-100 border-blue-300 text-blue-800", // Level 1
      "bg-green-100 border-green-300 text-green-800", // Level 2
      "bg-purple-100 border-purple-300 text-purple-800", // Level 3
      "bg-orange-100 border-orange-300 text-orange-800", // Level 4
      "bg-pink-100 border-pink-300 text-pink-800", // Level 5
      "bg-indigo-100 border-indigo-300 text-indigo-800", // Level 6
      "bg-yellow-100 border-yellow-300 text-yellow-800", // Level 7
      "bg-red-100 border-red-300 text-red-800", // Level 8
      "bg-teal-100 border-teal-300 text-teal-800", // Level 9
      "bg-gray-100 border-gray-300 text-gray-800", // Level 10
    ];
    return colors[level] || colors[colors.length - 1];
  };

  const handleClick = () => {
    onClick(node.id, node.level);
  };

  // Special styling for root node
  const isRoot = node.level === 0;
  const rootCursor = isRoot ? "cursor-default" : "cursor-pointer";

  const nodeContent = (
    <div
      className={`absolute transition-all duration-200 hover:shadow-lg ${rootCursor} ${
        node.isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: isRoot ? 280 : 220,
        height: isRoot ? 70 : 60, // Updated to use new shorter heights
      }}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full rounded-lg border-2 p-2 flex items-center justify-center ${getLevelColor(node.level)}`}
      >
        <div 
          className={`${isRoot ? 'text-base' : 'text-sm'} font-medium break-words leading-tight text-center`} 
          title={node.name}
        >
          {node.name}
        </div>
      </div>
    </div>
  );

  // Only wrap with tooltip if node has a description
  if (node.description && node.description.trim()) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {nodeContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{node.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return nodeContent;
};
