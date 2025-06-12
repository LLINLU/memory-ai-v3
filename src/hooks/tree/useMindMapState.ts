
import { useState, useCallback, useEffect } from "react";

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

  // Debug logging
  useEffect(() => {
    console.log("🔄 Mindmap state updated - Expanded nodes:", Array.from(expandedNodes));
  }, [expandedNodes]);

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    console.log("🔀 Toggling node expansion:", nodeId);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        console.log("➖ Collapsed node:", nodeId);
      } else {
        newSet.add(nodeId);
        console.log("➕ Expanded node:", nodeId);
      }
      return newSet;
    });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    console.log("➕ Expanding node:", nodeId);
    setExpandedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    console.log("➖ Collapsing node:", nodeId);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const isNodeExpanded = useCallback((nodeId: string) => {
    return expandedNodes.has(nodeId);
  }, [expandedNodes]);

  const expandRootNode = useCallback((rootNodeId: string) => {
    console.log("🌳 Expanding root node:", rootNodeId);
    setExpandedNodes(prev => new Set(prev).add(rootNodeId));
  }, []);

  return {
    expandedNodes,
    toggleNodeExpansion,
    expandNode,
    collapseNode,
    isNodeExpanded,
    expandRootNode,
  };
};
