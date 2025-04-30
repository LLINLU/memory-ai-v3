
import React from 'react';
import { Plus } from 'lucide-react';

interface CustomNodeButtonProps {
  onClick: () => void;
}

export const CustomNodeButton: React.FC<CustomNodeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 px-3 rounded-lg border border-dashed border-[#4A7DFC] text-[#4A7DFC] hover:bg-[#EBF3FF] transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="h-5 w-5" />
      Custom node
    </button>
  );
};
