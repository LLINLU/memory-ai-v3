import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface CollapsedSidebarProps {
  toggleSidebar: () => void;
}
export const CollapsedSidebar = ({
  toggleSidebar
}: CollapsedSidebarProps) => {
  return <div className="fixed right-2 top-[72px] z-10">
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={toggleSidebar} className="w-[40px] h-[40px] p-0 flex items-center justify-center text-white shadow-lg border-gray-300 bg-blue-700 hover:bg-blue-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>事例と論文を表示</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};