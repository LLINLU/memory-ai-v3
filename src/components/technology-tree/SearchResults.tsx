
import React, { useEffect, useState } from "react";
import { PaperList } from "./PaperList";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const SearchResults = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  
  // Update to expose refresh function
  const refreshResults = () => {
    console.log("SearchResults refreshing with new key");
    setRefreshKey(prev => prev + 1);
    // Show a toast notification when results are updated
    toast({
      title: "Results Updated",
      description: "Research results have been refreshed with new papers.",
      duration: 2000,
    });
  };

  // Effect to refresh the results when the path changes
  useEffect(() => {
    console.log("Path changed, refreshing results");
    setRefreshKey(prev => prev + 1);
  }, [location.pathname]);

  // Listen for the custom refresh event
  useEffect(() => {
    const handleCustomRefresh = () => {
      console.log("Custom refresh event received");
      refreshResults();
    };
    
    document.addEventListener('refresh-results', handleCustomRefresh);
    
    return () => {
      document.removeEventListener('refresh-results', handleCustomRefresh);
    };
  }, []);

  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]" data-sidebar="content">
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <PaperList key={refreshKey} onRefresh={refreshResults} />
    </div>
  );
};

