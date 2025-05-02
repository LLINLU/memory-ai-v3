
import React from 'react';
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { SidebarNavigation } from '@/components/sidebar/SidebarNavigation';
import { SidebarFooter } from '@/components/sidebar/SidebarFooter';

interface CollapsedSidebarProps {
  toggleSidebar: () => void;
}

export const CollapsedSidebar = ({ toggleSidebar }: CollapsedSidebarProps) => {
  return (
    <div className="w-[4rem] bg-white border-r border-gray-200 flex flex-col justify-between h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col items-center py-4">
        <Button 
          variant="ghost" 
          className="w-10 h-10 p-0 flex items-center justify-center text-gray-700" 
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        
        {/* Navigation Icons */}
        <div className="mt-6 w-full">
          <SidebarNavigation />
        </div>
      </div>
      
      {/* Footer Icons */}
      <div className="mb-4">
        <SidebarFooter />
      </div>
    </div>
  );
};
