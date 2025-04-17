
import React from 'react';
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

export const ZoomControls = () => {
  return (
    <div className="container mx-auto mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Zoom:</span>
          <Button variant="outline" size="sm" className="rounded-md">
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-md ml-1">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
