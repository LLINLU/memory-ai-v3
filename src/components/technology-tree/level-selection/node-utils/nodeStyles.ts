
import { TreeNode } from "@/types/tree";

export const getNodeStyle = (item: TreeNode, isSelected: boolean, level?: number) => {
  // Handle microscopy custom nodes specially
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    if (isSelected) {
      return 'bg-[rgb(72,58,59)] border-2 border-[#FBCA17] text-white';
    } else {
      return 'bg-[rgb(72,58,59)] text-white hover:border border-blue-400';
    }
  }
  
  // Apply level-specific styling
  if (level === 1) {
    return isSelected
      ? 'bg-[#3d5e80] text-white'
      : 'bg-[#f1f5f9] text-[#2E2E2E] hover:border border-blue-400';
  } else if (level === 2) {
    return isSelected
      ? 'bg-[#2e5e90] text-white'
      : 'bg-[#f0f8ff] text-[#2E2E2E] hover:border border-blue-400';
  } else if (level === 3) {
    return isSelected
      ? 'bg-[#4877b3] text-white'
      : 'bg-[#f0f6ff] text-[#2E2E2E] hover:border border-blue-400';
  }
  
  // Default styling for any other cases (fall back to original logic)
  else if (isSelected) {
    return item.isCustom
      ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
      : 'bg-[#4878e6] text-white';
  } else {
    return item.isCustom
      ? 'bg-[#FFF4CB] text-[#554444] hover:border border-blue-400'
      : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border border-blue-400';
  }
};

export const getTextColor = (item: TreeNode, isSelected: boolean, level?: number) => {
  // Handle microscopy custom nodes specially
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    return 'text-white';
  }
  
  // Apply level-specific text coloring
  if ((level === 1 || level === 2 || level === 3) && isSelected) {
    return 'text-white';
  } else if (level === 1 || level === 2 || level === 3) {
    return 'text-gray-600';
  }
  
  // Default styling for any other cases (fall back to original logic)
  else if (isSelected) {
    return item.isCustom ? 'text-[#483B3B]' : 'text-white';
  } else {
    return item.isCustom ? 'text-[#483B3B]' : 'text-gray-600';
  }
};
