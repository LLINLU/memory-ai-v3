
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowUpRight, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  isExpanded: boolean;
  isMinimized?: boolean;
  toggleExpand: () => void;
  toggleMinimize?: () => void;
  toggleOpen: () => void;
}

export const ChatHeader = ({
  isExpanded,
  isMinimized = false,
  toggleExpand,
  toggleMinimize,
  toggleOpen
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-gray-800 text-lg">AI Research Assistant</h3>
      </div>
      <div className="flex items-center gap-1">
        {toggleMinimize && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMinimize}
            className={cn(
              "h-9 w-9 hover:bg-white/50 rounded-full transition-all duration-200",
              "hover:scale-110 active:scale-95"
            )}
          >
            <Minimize2 className="h-4 w-4 text-gray-600" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleExpand}
          className={cn(
            "h-9 w-9 hover:bg-white/50 rounded-full transition-all duration-200",
            "hover:scale-110 active:scale-95"
          )}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4 text-gray-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-gray-600" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleOpen}
          className={cn(
            "h-9 w-9 hover:bg-red-50 rounded-full transition-all duration-200",
            "hover:scale-110 active:scale-95"
          )}
        >
          <X className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};
