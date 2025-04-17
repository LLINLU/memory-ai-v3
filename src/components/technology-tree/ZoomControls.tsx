
import React from 'react';
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ZoomControlsProps {
  hasUserMadeSelection: boolean;
}

export const ZoomControls = ({ hasUserMadeSelection }: ZoomControlsProps) => {
  return (
    <div className="container mx-auto mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Zoom:</span>
          <Button variant="outline" size="sm" className="rounded-md">
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-md ml-1">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const sidebarElement = document.querySelector('[data-sidebar="content"]');
                    if (sidebarElement) {
                      sidebarElement.scrollTo({ top: 0, behavior: 'smooth' });
                      // Find and click the "View all papers" button to refresh content
                      const viewAllButton = document.querySelector('[data-sidebar="content"] button:last-child') as HTMLButtonElement;
                      if (viewAllButton) {
                        viewAllButton.click();
                      }
                    }
                  }}
                  disabled={!hasUserMadeSelection}
                >
                  Update Results
                </Button>
              </div>
            </TooltipTrigger>
            {!hasUserMadeSelection && (
              <TooltipContent>
                <p>Change the path, then results will be updated</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
