
import React from "react";
import { Link } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarHeader() {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        {isExpanded && (
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold whitespace-nowrap">
            <span className="text-blue-600">M</span>
            <span>Memory AI</span>
          </Link>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={`h-8 w-8 ${!isExpanded ? 'flex items-center justify-center -ml-1' : ''}`}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
