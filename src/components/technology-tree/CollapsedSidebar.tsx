
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CollapsedSidebarProps {
  toggleSidebar: () => void;
}

export const CollapsedSidebar = ({ toggleSidebar }: CollapsedSidebarProps) => {
  return (
    <div className="fixed right-0 top-[64px] bottom-0 w-[50px] bg-[#F3F3E8] border-l border-gray-200 shadow-sm flex flex-col transition-all duration-300 z-10">
      <Button 
        variant="outline" 
        className="absolute top-2 left-2 w-[40px] h-[40px] p-0 flex items-center justify-center bg-[#1A1F2C] text-white" 
        onClick={toggleSidebar}
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
