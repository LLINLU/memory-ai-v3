
import React, { useEffect } from "react";
import { PaperList } from "./PaperList";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";

export const SearchResults = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("papers");

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
      
      <Tabs defaultValue="papers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="papers" className="flex-1">
            <Book className="w-4 h-4 mr-2" />
            Papers
          </TabsTrigger>
          <TabsTrigger value="implementation" className="flex-1">
            <Code className="w-4 h-4 mr-2" />
            Implementation
          </TabsTrigger>
        </TabsList>
        
        {activeTab === "papers" ? (
          <PaperList />
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Commercial AO-SLO System</h4>
              <p className="text-gray-600 text-sm">
                Commercially available adaptive optics system for clinical ophthalmology applications. 
                Features real-time wavefront sensing and high-speed image acquisition.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Research-Grade AO Platform</h4>
              <p className="text-gray-600 text-sm">
                Custom-built adaptive optics system integrating multiple imaging modalities. 
                Enables simultaneous fluorescence imaging and structural assessment.
              </p>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};
