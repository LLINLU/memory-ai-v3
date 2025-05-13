
import { TreeNode } from "@/types/tree";

export const getNodeStyle = (item: TreeNode, isSelected: boolean) => {
  // Special color for microscopy custom nodes (RGB 72,58,59)
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    if (isSelected) {
      return 'bg-[rgb(72,58,59)] border-2 border-[#FBCA17] text-white';
    } else {
      return 'bg-[rgb(72,58,59)] text-white hover:border border-blue-400';
    }
  } else if (isSelected) {
    return item.isCustom
      ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
      : 'bg-[#4878e6] text-white';
  } else {
    return item.isCustom
      ? 'bg-[#FFF4CB] text-[#554444] hover:border border-blue-400'
      : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border border-blue-400';
  }
};

export const getTextColor = (item: TreeNode, isSelected: boolean) => {
  if (item.isCustom && item.name.toLowerCase().includes('microscopy')) {
    return 'text-white';
  } else if (isSelected) {
    return item.isCustom ? 'text-[#483B3B]' : 'text-white';
  } else {
    return item.isCustom ? 'text-[#483B3B]' : 'text-gray-600';
  }
};
