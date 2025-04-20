
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarSearches } from "./sidebar/SidebarSearches";
import { SidebarFooter as CustomSidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNavigation />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarSearches />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <CustomSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
