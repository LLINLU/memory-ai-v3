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
import { NodeLoadingIndicator } from "../level-selection/node-components/NodeLoadingIndicator";
import { getLevelColors } from "@/utils/levelColors";

interface MindMapNodeProps {
  node: MindMapNode;
  layoutDirection: 'horizontal' | 'vertical';
  onClick: (nodeId: string, level: number) => void;
  onEdit?: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  onDelete?: (level: string, nodeId: string) => void;
  onAiAssist?: (nodeId: string, level: number) => void;
  onAddNode?: (nodeId: string, level: number) => void;
}

export const MindMapNodeComponent: React.FC<MindMapNodeProps> = ({
  node,
  layoutDirection,
  onClick,
  onEdit,
  onDelete,
  onAiAssist,
  onAddNode,
}) => {
  const { toast } = useToast();

  // Layout-specific dimensions
  const getNodeWidth = () => layoutDirection === 'horizontal' ? 280 : 120;
  const getNodeHeight = () => {
    const isRoot = node.level === 0;
    if (layoutDirection === 'horizontal') {
      return isRoot ? 70 : 60;
    } else {
      return isRoot ? 110 : 100;
    }
  };

  const getNodeStyling = () => {
    if (node.isSelected) {
      // Selected nodes get the custom blue background with white text
      return "bg-[#2563eb] border-[#2563eb] text-white";
    }
    // Non-selected nodes use the shared level colors
    return getLevelColors(node.level);
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
    console.log("AI Assist clicked for node:", node.id, "level:", node.level);
    if (onAiAssist) {
      onAiAssist(node.id, node.level);
    }
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Add Node clicked for node:", node.id, "level:", node.level);
    if (onAddNode) {
      onAddNode(node.id, node.level);
    }
  };
  // Special styling for root node
  const isRoot = node.level === 0;
  const rootCursor = isRoot ? "cursor-default" : "cursor-pointer";
  // Check if this node is being generated (children_count = 0 for TED scenario nodes only)
  // Only Level 1 nodes (scenarios) should show generating status when children_count = 0
  // Level 4+ nodes naturally have children_count = 0 as leaf nodes
  const isGenerating =
    typeof node.children_count === "number" && 
    node.children_count === 0 && 
    node.level === 1; // Only show generating for Level 1 (scenario) nodes

  const nodeContent = (
    <div
      className={`absolute transition-all duration-200 hover:shadow-lg ${rootCursor}`}
      style={{
        left: node.x,
        top: node.y,
        width: getNodeWidth(),
        height: getNodeHeight(),
      }}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full rounded-lg border-2 p-2 flex ${
          isGenerating ? "flex-col" : "items-center"
        } justify-center ${getNodeStyling()}`}
      >
        <div
          className={`${
            isRoot ? "text-base" : "text-sm"
          } font-medium break-words leading-tight text-center ${
            isGenerating ? "mb-1" : ""
          }`}
          title={node.name}
        >
          {node.name}
        </div>{" "}
        {isGenerating && (
          <div className="mt-1">
            <NodeLoadingIndicator size="sm" />
          </div>
        )}
      </div>
    </div>
  );

  // Only wrap with tooltip if node has a description and is not root
  if (node.description && node.description.trim() && !isRoot) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{nodeContent}</TooltipTrigger>
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
