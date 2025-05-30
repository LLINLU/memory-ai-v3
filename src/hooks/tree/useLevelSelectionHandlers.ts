
import { useRef } from "react";
import { toast } from "@/hooks/use-toast";

export const useLevelSelectionHandlers = (
  selectedPath: any,
  onNodeClick: (level: string, nodeId: string) => void,
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void,
  onDeleteNode?: (level: string, nodeId: string) => void
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeSelection = (level: string, nodeId: string) => {
    if (selectedPath[level] !== nodeId) {
      // Create custom event to refresh paper list with node information
      const refreshEvent = new CustomEvent('refresh-papers', {
        detail: { level, nodeId, timestamp: Date.now() }
      });
      document.dispatchEvent(refreshEvent);
      
      // Show notification to user with 1-second duration
      toast({
        title: "Results updated",
        description: "The paper list has been updated based on your selection",
        duration: 1000,
      });
      
      console.log("Node selection event:", { level, nodeId, refreshEvent });
    }
    
    onNodeClick(level, nodeId);
  };

  const handleEditNode = (level: string, nodeId: string, updatedNode: { title: string; description: string }) => {
    if (onEditNode) {
      onEditNode(level, nodeId, updatedNode);
      toast({
        title: "Node updated",
        description: `Changes to "${updatedNode.title}" have been saved`,
        duration: 2000,
      });
    }
  };

  const handleDeleteNode = (level: string, nodeId: string) => {
    if (onDeleteNode) {
      onDeleteNode(level, nodeId);
      toast({
        title: "ノードが削除されました",
        description: "ノードは正常に削除されました",
        duration: 2000,
      });
    }
  };

  return {
    containerRef,
    handleNodeSelection,
    handleEditNode,
    handleDeleteNode
  };
};
