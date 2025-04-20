
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          tooltip="Home"
        >
          <Link to="/">
            <Home />
            {state === 'expanded' && <span>Home</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="History"
        >
          <History />
          {state === 'expanded' && <span>History</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
