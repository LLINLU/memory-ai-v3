
import React from "react";
import { MessageSquare, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MindMapNodeActionTooltipProps {
  nodeName: string;
  onAiAssistant?: () => void;
  onAddNode?: () => void;
  onCopyTitle?: () => void;
}

export const MindMapNodeActionTooltip: React.FC<MindMapNodeActionTooltipProps> = ({
  nodeName,
  onAiAssistant,
  onAddNode,
  onCopyTitle,
}) => {
  const handleCopyTitle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(nodeName);
      toast({
        title: "Copied to clipboard",
        description: `"${nodeName}" has been copied to your clipboard.`,
      });
      if (onCopyTitle) {
        onCopyTitle();
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAiAssistant = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAiAssistant) {
      onAiAssistant();
    }
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddNode) {
      onAddNode();
    }
  };

  return (
    <div className="flex gap-1 p-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-blue-100"
        onClick={handleAiAssistant}
        title="AI Assistant"
      >
        <MessageSquare className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-green-100"
        onClick={handleAddNode}
        title="Add Node"
      >
        <Plus className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-gray-100"
        onClick={handleCopyTitle}
        title="Copy Title"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
};
