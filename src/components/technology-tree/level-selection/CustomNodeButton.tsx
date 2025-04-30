
import React from 'react';
import { Plus } from 'lucide-react';

interface CustomNodeButtonProps {
  onClick: () => void;
}

export const CustomNodeButton: React.FC<CustomNodeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="h-5 w-5" />
      Custom node
    </button>
  );
};
