
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
            className="w-full flex justify-start pl-3"
          >
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-2">Settings</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Profile"
            className="w-full flex justify-start pl-3"
          >
            <Avatar className="size-5">
              <AvatarFallback className="size-5 p-0">
                <UserRound className="size-4" />
              </AvatarFallback>
            </Avatar>
            {isExpanded && <span className="ml-2">Profile</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
