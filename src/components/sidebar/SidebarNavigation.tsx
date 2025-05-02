
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, History, GitBranch } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';
  const location = useLocation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          tooltip="Search"
          isActive={location.pathname === '/'}
        >
          <Link to="/">
            <Search />
            {isExpanded && <span>Search</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="History"
        >
          <History />
          {isExpanded && <span>History</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          tooltip="Technology Tree"
          isActive={location.pathname === '/technology-tree'}
        >
          <Link to="/technology-tree">
            <GitBranch />
            {isExpanded && <span>Tech Tree</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
