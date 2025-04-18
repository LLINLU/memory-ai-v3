
import { Navigation } from "@/components/Navigation";
import { SearchSection } from "@/components/SearchSection";
import { RecentSearches } from "@/components/RecentSearches";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HomeSidebar } from "@/components/home/HomeSidebar";

const Index = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-gray-50">
        <HomeSidebar />
        <div className="flex-1">
          <Navigation />
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Memory AI</h1>
              </div>
              <SearchSection />
              <RecentSearches />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
