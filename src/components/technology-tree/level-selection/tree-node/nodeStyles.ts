
interface NodeStyleProps {
  isSelected: boolean;
  isCustom?: boolean;
}

export const getNodeBackgroundClass = ({ isSelected, isCustom }: NodeStyleProps): string => {
  if (isSelected) {
    return isCustom
      ? 'bg-[#FFE194] border-2 border-[#FBCA17] text-[#483B3B]'
      : 'bg-[#4A7DFC] text-white';
  }
  
  return isCustom
    ? 'bg-[#FFF4CB] text-[#554444] hover:border-[0.5px] border-blue-400'
    : 'bg-[#E6F0FF] text-[#2E2E2E] hover:border-[0.5px] border-blue-400';
};
