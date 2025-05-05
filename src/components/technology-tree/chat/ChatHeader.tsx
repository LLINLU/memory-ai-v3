
import React from 'react';
import { Button } from "@/components/ui/button";
import { Minimize2, Maximize2, X } from "lucide-react";

interface ChatHeaderProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  toggleOpen: () => void;
}

export const ChatHeader = ({
  isExpanded,
  toggleExpand,
  toggleOpen
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
      <h3 className="font-medium text-gray-800">AI Research Assistant</h3>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleExpand}
          className="h-8 w-8"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleOpen}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
