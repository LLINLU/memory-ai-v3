
import React from "react";
import { Bell, Settings } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarFooter() {
  const { state } = useSidebar();

  return (
    <div className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Notifications"
          >
            <Bell />
            {state === 'expanded' && <span>Notifications</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Settings"
          >
            <Settings />
            {state === 'expanded' && <span>Settings</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
