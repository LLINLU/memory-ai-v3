
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResultsHeader } from "./components/ResultsHeader";
import { TabNavigator } from "./components/TabNavigator";
import { TabContent } from "./components/TabContent";

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
    <div className="h-full p-4 overflow-auto bg-[#fdfdfd]" data-sidebar="content">
      <ResultsHeader />
      <TabNavigator onValueChange={setActiveTab} />
      <TabContent 
        activeTab={activeTab} 
        selectedNodeTitle={selectedNodeTitle} 
        selectedNodeDescription={selectedNodeDescription}
      />
    </div>
  );
};
