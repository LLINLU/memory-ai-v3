
import React from 'react';
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ZoomControlsProps {
  hasUserMadeSelection: boolean;
}

export const ZoomControls = ({ hasUserMadeSelection }: ZoomControlsProps) => {
  const handleViewResults = () => {
    // Create a custom event to refresh the paper list
    const refreshEvent = new CustomEvent('refresh-papers');
    document.dispatchEvent(refreshEvent);
    
    // Show notification to user
    toast({
      title: "Results updated",
      description: "The paper list has been updated based on your selection",
      duration: 3000,
    });
  };

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
        <Button
          variant="outline"
          onClick={handleViewResults}
          disabled={!hasUserMadeSelection}
        >
          Update Results
        </Button>
      </div>
    </div>
  );
};
