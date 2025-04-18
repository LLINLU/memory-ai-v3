
import { History, Home, PanelLeft, Bell, Settings, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const HomeSidebar = () => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <Sidebar className="bg-white border-r border-gray-100 relative" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-bold text-2xl">M</span>
                <span className="font-semibold text-xl">Memory AI</span>
              </div>
              <PanelLeft className="w-5 h-5 cursor-pointer" onClick={toggleSidebar} />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Home">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="History">
                  <History className="w-5 h-5" />
                  <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Notifications">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Additional toggle button that's always visible when collapsed */}
      {state === "collapsed" && (
        <div 
          className="absolute top-4 left-[calc(100%)] transform -translate-x-1/2 z-20 bg-white rounded-full shadow-md cursor-pointer p-1"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4 text-blue-600" />
        </div>
      )}
    </Sidebar>
  );
};
