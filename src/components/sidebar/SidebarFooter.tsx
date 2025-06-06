
import React from "react";
import { Settings, LogOut, UserRound } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuthContext } from "@/components/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarFooter() {
  const { state } = useSidebar();
  const { profile, signOut } = useAuthContext();
  const isExpanded = state === 'expanded';

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="設定"
          >
            <Settings />
            {isExpanded && <span>設定</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={profile?.username || "プロフィール"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-4">
                  <AvatarFallback className="size-4 p-0 text-xs">
                    {profile?.username 
                      ? getUserInitials(profile.username)
                      : <UserRound className="size-4" />
                    }
                  </AvatarFallback>
                </Avatar>
                {isExpanded && <span>{profile?.username || "ユーザー"}</span>}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              alignOffset={-4}
              side="top"
            >
              <DropdownMenuLabel className="text-xs">
                {profile?.username || "ユーザー"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
