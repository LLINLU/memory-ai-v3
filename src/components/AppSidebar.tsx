
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarSearches } from "./sidebar/SidebarSearches";
import { SidebarFooter as CustomSidebarFooter } from "./sidebar/SidebarFooter";

interface AppSidebarProps {
  defaultCollapsed?: boolean;
}

export function AppSidebar({ defaultCollapsed }: AppSidebarProps = {}) {
  return (
    <Sidebar defaultCollapsed={defaultCollapsed}>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarNavigation />
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
