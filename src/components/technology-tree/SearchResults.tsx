
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabContent } from "./components/TabContent";
import { SelectedNodeInfo } from "./components/SelectedNodeInfo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultsProps {
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
}

export const SearchResults = ({ selectedNodeTitle, selectedNodeDescription }: SearchResultsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("papers");

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      console.log("SearchResults component detected refresh event:", event);
      
      // Reset scroll position
      const sidebarContent = document.querySelector('[data-sidebar="content"]');
      if (sidebarContent) {
        sidebarContent.scrollTop = 0;
      }
      
      // Ensure we're on the papers tab
      setActiveTab("papers");
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, [toast]);

  return (
    <div className="h-full flex flex-col bg-white" data-sidebar="content">
      <div className="p-4">
        <SelectedNodeInfo 
          title={selectedNodeTitle} 
          description={selectedNodeDescription}
        />
        <div className="flex items-center justify-between mb-6">
          <TabNavigator onValueChange={setActiveTab} />
          <FilterSort className="justify-end" />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 pb-4">
        {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
      </ScrollArea>
    </div>
  );
};

// Import these at the top level instead
import { TabNavigator } from "./components/TabNavigator";
import { FilterSort } from "./FilterSort";
import { PaperList } from "./PaperList";
import { ImplementationList } from "./ImplementationList";
