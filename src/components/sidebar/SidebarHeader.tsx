
import React from "react";
import { Link } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";

export function SidebarHeader() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        {state === 'expanded' && (
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-blue-600">M</span>
            <span>Memory AI</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
    </div>
  );
}
