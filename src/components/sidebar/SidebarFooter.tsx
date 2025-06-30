import React, { useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Settings, LogOut, UserRound } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
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
import { useUserDetail } from "@/hooks/useUserDetail";

export function SidebarFooter() {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const { user, signOut } = useAuth();
  const { userDetails } = useUserDetail();
  const isExpanded = state === "expanded";

  const handleSignOut = async () => {
    await signOut();
  };

  const [hasAccess, setHasAccess] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  const displayName = useMemo(() => {
    return userDetails?.username || "ユーザー";
  }, [userDetails, user]);

  const nameForInitials = useMemo(() => {
    return userDetails?.username || "User";
  }, [userDetails, user]);

  return (
    <div className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="管理者画面"
            onClick={() => navigate("/admin")}
          >
            {isExpanded && <span>管理者画面</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="設定">
            <Settings />
            {isExpanded && <span>設定</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={displayName}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-4">
                  <AvatarFallback className="size-4 p-0 text-xs">
                    <UserRound className="size-4" />
                  </AvatarFallback>
                </Avatar>
                {isExpanded && <span>{displayName}</span>}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              alignOffset={-4}
              side="top"
            >
              <DropdownMenuLabel className="text-xs">
                {displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
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
