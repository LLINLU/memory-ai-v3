
import React from "react";
import { Settings } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarFooter() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <div className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Settings"
          >
            <Settings />
            {isExpanded && <span>Settings</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Profile"
          >
            <Avatar className="size-4">
              <AvatarFallback className="size-4 p-0">
                <UserRound className="size-4" />
              </AvatarFallback>
            </Avatar>
            {isExpanded && <span>Profile</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
