
import { useState, useCallback } from "react";

export interface MindMapNode {
  id: string;
  name: string;
  description?: string;
  info?: string;
  isCustom?: boolean;
  level: number;
  children: MindMapNode[];
  isExpanded: boolean;
  x?: number;
  y?: number;
}

export const useMindMapState = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const isNodeExpanded = useCallback((nodeId: string) => {
    return expandedNodes.has(nodeId);
  }, [expandedNodes]);

  return {
    expandedNodes,
    toggleNodeExpansion,
    expandNode,
    collapseNode,
    isNodeExpanded,
  };
};
