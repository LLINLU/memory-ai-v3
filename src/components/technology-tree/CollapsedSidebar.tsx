
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CollapsedSidebarProps {
  toggleSidebar: () => void;
}

export const CollapsedSidebar = ({ toggleSidebar }: CollapsedSidebarProps) => {
  return (
    <div className="fixed right-2 top-[72px] z-10">
      <Button 
        variant="outline" 
        className="w-[40px] h-[40px] p-0 flex items-center justify-center bg-[#1A1F2C] text-white shadow-lg border-gray-300" 
        onClick={toggleSidebar}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
};
