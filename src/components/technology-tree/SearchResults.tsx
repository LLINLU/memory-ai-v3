
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResultsHeader } from "./components/ResultsHeader";
import { TabNavigator } from "./components/TabNavigator";
import { TabContent } from "./components/TabContent";

export const SearchResults = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("papers");

  useEffect(() => {
    const handleRefresh = () => {
      console.log("SearchResults component detected refresh event");
      
      const sidebarContent = document.querySelector('[data-sidebar="content"]');
      if (sidebarContent) {
        sidebarContent.scrollTop = 0;
      }
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, [toast]);

  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]" data-sidebar="content">
      <ResultsHeader />
      <TabNavigator onValueChange={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  );
};
