
import React, { useEffect } from "react";
import { PaperList } from "./PaperList";
import { useToast } from "@/hooks/use-toast";

export const SearchResults = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Event listener for the refresh-papers event to show toast
    const handleRefresh = () => {
      console.log("SearchResults component detected refresh event");
      
      // Scroll the sidebar to the top to show updated content
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
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <PaperList />
    </div>
  );
};
