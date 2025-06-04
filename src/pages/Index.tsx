import { SearchSection } from "@/components/SearchSection";
import { RecentSearches } from "@/components/RecentSearches";
import { TreeGenerationSection } from "@/components/TreeGenerationSection";
import { RecentGeneratedTrees } from "@/components/RecentGeneratedTrees";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full items-center justify-center">
        <AppSidebar />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="relative w-full max-w-5xl">
              <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
              <div className="max-w-4xl mx-auto space-y-8">
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    {/* Remove Search <TabsTrigger value="search">検索・探索</TabsTrigger> */}
                    <TabsTrigger value="generate">ツリー生成</TabsTrigger>
                  </TabsList>
                  {/* Remove Search
                  TabsContent value="search" className="space-y-6">
                    <SearchSection />
                    <RecentSearches />
                  </TabsContent--!>{" "}
                  */}
                  <TabsContent value="generate" className="space-y-6">
                    <TreeGenerationSection />
                    <RecentGeneratedTrees />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
