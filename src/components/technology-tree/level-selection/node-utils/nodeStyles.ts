
import { TreeNode } from "@/types/tree";

export const getNodeStyle = (item: TreeNode, isSelected: boolean, level?: number) => {
  // For selected nodes, use the same blue highlighting as mindmap
  if (isSelected) {
    return 'bg-[#2563eb] border-[#2563eb] text-white';
  }

  // Handle microscopy custom nodes specially
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    return 'bg-[rgb(72,58,59)] text-white hover:border border-blue-400';
  }
  
  // Apply level-specific styling for non-selected nodes
  if (level === 1) {
    return 'bg-[#f1f5f9] text-[#2E2E2E] hover:border border-blue-400';
  } else if (level === 2) {
    return 'bg-[#f0f8ff] text-[#2E2E2E] hover:border border-blue-400';
  } else if (level === 3) {
    return 'bg-[#f0f6ff] text-[#2E2E2E] hover:border border-blue-400';
  }
  
  // Default styling for any other cases
  return item.isCustom
    ? 'bg-[#FFF4CB] text-[#554444] hover:border border-blue-400'
    : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border border-blue-400';
};

export const getTextColor = (item: TreeNode, isSelected: boolean, level?: number) => {
  // For selected nodes, always use white text
  if (isSelected) {
    return 'text-white';
  }

  // Handle microscopy custom nodes specially
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    return 'text-white';
  }
  
  // For non-selected nodes, use appropriate text colors
  return 'text-gray-600';
};
