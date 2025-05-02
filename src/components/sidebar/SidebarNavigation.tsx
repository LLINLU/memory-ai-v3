
import React from "react";
import { Link } from "react-router-dom";
import { Search, History } from "lucide-react";
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
          tooltip="Search"
          className="w-full flex justify-start pl-3"
        >
          <Link to="/">
            <Search className="h-5 w-5" />
            {isExpanded && <span className="ml-2">Search</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="History"
          className="w-full flex justify-start pl-3"
        >
          <History className="h-5 w-5" />
          {isExpanded && <span className="ml-2">History</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
