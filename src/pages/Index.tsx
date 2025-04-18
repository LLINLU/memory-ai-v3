
import { Navigation } from "@/components/Navigation";
import { SearchSection } from "@/components/SearchSection";
import { RecentSearches } from "@/components/RecentSearches";
import { SidebarProvider } from "@/components/ui/sidebar";
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
