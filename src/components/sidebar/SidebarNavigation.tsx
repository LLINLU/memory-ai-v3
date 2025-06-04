
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
          tooltip="検索"
        >
          <Link to="/">
            <Search />
            {isExpanded && <span>検索</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip="履歴"
        >
          <History />
          {isExpanded && <span>履歴</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
