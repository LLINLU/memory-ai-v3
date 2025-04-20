
import React from "react";
import { Link } from "react-router-dom";
import { Home, History } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          tooltip="Toggle Sidebar"
        >
          <Link to="/">
            <Home />
            {isExpanded && <span>Home</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {isExpanded && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="History"
          >
            <History />
            {isExpanded && <span>History</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
