
import React from 'react';
import { Plus } from 'lucide-react';

interface CustomNodeButtonProps {
  onClick: () => void;
}

export const CustomNodeButton: React.FC<CustomNodeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={(e) => {
        // Expand the chatbox when custom node button is clicked
        const chatbox = document.querySelector('[data-chatbox]');
        if (chatbox) {
          // Set a custom attribute to indicate it should be opened and expanded
          chatbox.setAttribute('data-chatbox-open', 'true');
          chatbox.setAttribute('data-chatbox-expanded', 'true');
        }
        
        // Then call the original onClick handler
        console.log("Add node button clicked");
        onClick();
      }}
      className="w-full py-3 px-3 rounded-lg border border-dashed border-[#4A7DFC] text-[#4A7DFC] hover:bg-[#EBF3FF] transition-colors flex items-center justify-center gap-2 text-[14px]"
    >
      <Plus className="h-5 w-5" />
      追加する
    </button>
  );
};
