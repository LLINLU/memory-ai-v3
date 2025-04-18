import { History, Home, PanelLeft, Bell, Settings, Clock, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

export const HomeSidebar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="bg-white border-r border-gray-100" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-4 flex items-center gap-3">
              <span className="text-blue-600 font-bold text-2xl">M</span>
              <span className="font-semibold text-xl">Memory AI</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Menu" onClick={toggleSidebar}>
                  <PanelLeft className="w-5 h-5" />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                "Quantum computing and cryptography",
                "Machine learning in healthcare",
                "Climate change mitigation",
                "Neural network architecture",
                "Sustainable energy solutions"
              ].map((search) => (
                <SidebarMenuItem key={search}>
                  <SidebarMenuButton>
                    <Clock className="w-4 h-4" />
                    <span className="truncate">{search}</span>
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
                "Blockchain technology applications",
                "Genetic algorithms optimization",
                "Virtual reality in education"
              ].map((search) => (
                <SidebarMenuItem key={search}>
                  <SidebarMenuButton>
                    <Search className="w-4 h-4" />
                    <span className="truncate">{search}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
    </Sidebar>
  );
};
