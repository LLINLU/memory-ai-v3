import { History, Home, Bell, Settings, PanelLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";

export const HomeSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent>
        <div className="flex items-center justify-between mb-4 px-2">
          <h1 className="text-xl font-bold">Memory AI</h1>
          <SidebarTrigger />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupLabel>Recent Searches</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                "Quantum computing a...",
                "Machine learning in he...",
                "Climate change mitigat...",
                "Neural network archite...",
                "Sustainable energy sol..."
              ].map((search) => (
                <SidebarMenuItem key={search}>
                  <SidebarMenuButton tooltip={search}>
                    <History className="w-4 h-4" />
                    <span>{search}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Previous searches</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                "Blockchain technology ...",
                "Genetic algorithms opt...",
                "Virtual reality in educa..."
              ].map((search) => (
                <SidebarMenuItem key={search}>
                  <SidebarMenuButton tooltip={search}>
                    <History className="w-4 h-4" />
                    <span>{search}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
    </Sidebar>
  );
};
