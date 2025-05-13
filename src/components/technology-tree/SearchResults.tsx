
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabContent } from "./components/TabContent";
import { SelectedNodeInfo } from "./components/SelectedNodeInfo";

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
      
      // Ensure we're on the papers tab
      setActiveTab("papers");
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, [toast]);

  return (
    <div className="bg-white pb-8" data-search-results="content">
      <SelectedNodeInfo 
        title={selectedNodeTitle} 
        description={selectedNodeDescription}
      />
      <TabContent 
        activeTab={activeTab} 
        onValueChange={setActiveTab}
      />
    </div>
  );
};
