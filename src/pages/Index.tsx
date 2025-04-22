
import { SearchSection } from "@/components/SearchSection";
import { RecentSearches } from "@/components/RecentSearches";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full items-center justify-center">
        <AppSidebar />
        <div className="flex-1">
          <div className="absolute top-4 right-4">
            <Avatar>
              <AvatarFallback>
                <UserRound className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="relative w-full max-w-5xl">
              <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
              <div className="max-w-4xl mx-auto">
                <SearchSection />
                <RecentSearches />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
