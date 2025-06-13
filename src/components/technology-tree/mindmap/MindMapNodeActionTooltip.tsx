
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Copy } from "lucide-react";

interface MindMapNodeActionTooltipProps {
  children: React.ReactNode;
  nodeTitle: string;
  onAiAssistant?: () => void;
  onAddNode?: () => void;
  onCopyTitle?: () => void;
}

export const MindMapNodeActionTooltip: React.FC<MindMapNodeActionTooltipProps> = ({
  children,
  nodeTitle,
  onAiAssistant,
  onAddNode,
  onCopyTitle,
}) => {
  const handleCopyTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nodeTitle);
    if (onCopyTitle) {
      onCopyTitle();
    }
  };

  const handleAiAssistant = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAiAssistant) {
      onAiAssistant();
    }
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddNode) {
      onAddNode();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white border border-gray-200 shadow-lg p-1">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-blue-50"
              onClick={handleAiAssistant}
              title="AI Assistant"
            >
              <MessageSquare className="h-3 w-3 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-green-50"
              onClick={handleAddNode}
              title="Add Node"
            >
              <Plus className="h-3 w-3 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-50"
              onClick={handleCopyTitle}
              title="Copy Title"
            >
              <Copy className="h-3 w-3 text-gray-600" />
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
