
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, History, Settings } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const isExpanded = state === 'expanded';
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // 管理者権限チェック
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setHasAdminAccess(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('is-app-admin', {
          body: { userId: user.id }
        });

        if (error) {
          console.error('Admin check error:', error);
          setHasAdminAccess(false);
        } else {
          setHasAdminAccess(data?.isAdmin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setHasAdminAccess(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

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
      {hasAdminAccess && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild
            tooltip="管理者"
          >
            <Link to="/admin">
              <Settings />
              {isExpanded && <span>管理者</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
