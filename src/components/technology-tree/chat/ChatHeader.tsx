
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowUpRight } from "lucide-react";

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
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h3 className="font-medium text-gray-900">AI Research Assistant</h3>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleExpand}
          className="h-8 w-8 hover:bg-gray-100 rounded-full"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleOpen}
          className="h-8 w-8 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
