
import React from "react";
import { MindMapNode } from "@/utils/mindMapDataTransform";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MessageSquare, CirclePlus, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MindMapNodeProps {
  node: MindMapNode;
  onClick: (nodeId: string, level: number) => void;
  onEdit?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDelete?: (level: string, nodeId: string) => void;
  onAiAssist?: (nodeId: string, level: number) => void;
  onAddNode?: (nodeId: string, level: number) => void;
}

export const MindMapNodeComponent: React.FC<MindMapNodeProps> = ({
  node,
  onClick,
  onEdit,
  onDelete,
  onAiAssist,
  onAddNode,
}) => {
  const { toast } = useToast();

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

  const getNodeStyling = () => {
    if (node.isSelected) {
      // Selected nodes get the custom blue background with white text
      return "bg-[#2563eb] border-[#2563eb] text-white";
    }
    // Non-selected nodes use the existing level colors
    return getLevelColor(node.level);
  };

  const handleClick = () => {
    onClick(node.id, node.level);
  };

  const handleCopyTitle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(node.name);
      toast({
        title: "Title copied to clipboard",
        description: node.name,
      });
    } catch (error) {
      toast({
        title: "Failed to copy title",
        description: "Please try again",
      });
    }
  };

  const handleAiAssist = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('AI Assist clicked for node:', node.id, 'level:', node.level);
    if (onAiAssist) {
      onAiAssist(node.id, node.level);
    }
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add Node clicked for node:', node.id, 'level:', node.level);
    if (onAddNode) {
      onAddNode(node.id, node.level);
    }
  };

  // Special styling for root node
  const isRoot = node.level === 0;
  const rootCursor = isRoot ? "cursor-default" : "cursor-pointer";

  const nodeContent = (
    <div
      className={`absolute transition-all duration-200 hover:shadow-lg ${rootCursor}`}
      style={{
        left: node.x,
        top: node.y,
        width: 280, // All nodes now use the same width (280px)
        height: isRoot ? 70 : 60, // Updated to use new shorter heights
      }}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full rounded-lg border-2 p-2 flex items-center justify-center ${getNodeStyling()}`}
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

  // Only wrap with tooltip if node has a description and is not root
  if (node.description && node.description.trim() && !isRoot) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {nodeContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="mb-3">{node.description}</p>
          <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAiAssist}
              className="h-7 w-7 p-0"
              title="AI Assistant"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddNode}
              className="h-7 w-7 p-0"
              title="Add Node"
            >
              <CirclePlus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTitle}
              className="h-7 w-7 p-0"
              title="Copy Title"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return nodeContent;
};
