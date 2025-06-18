
import { useState, useCallback } from 'react';

interface VisualSelection {
  level: number;
  nodeId: string;
}

export const useVisualSelection = () => {
  const [visuallySelectedNode, setVisuallySelectedNode] = useState<VisualSelection | null>(null);

  const setVisualSelection = useCallback((level: number, nodeId: string) => {
    setVisuallySelectedNode({ level, nodeId });
  }, []);

  const clearVisualSelection = useCallback(() => {
    setVisuallySelectedNode(null);
  }, []);

  const isNodeVisuallySelected = useCallback((level: number, nodeId: string): boolean => {
    return visuallySelectedNode?.level === level && visuallySelectedNode?.nodeId === nodeId;
  }, [visuallySelectedNode]);

  return {
    visuallySelectedNode,
    setVisualSelection,
    clearVisualSelection,
    isNodeVisuallySelected,
  };
};
