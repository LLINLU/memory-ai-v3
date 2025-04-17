import React, { useEffect } from "react";
import { PaperList } from "./PaperList";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Commercial AO-SLO System</h4>
                <Badge className="ml-2 bg-[#E8F1FF] text-[#0EA5E9] border-0 hover:bg-[#E8F1FF]">3 releases</Badge>
              </div>
              <p className="text-gray-600 text-sm">
                Commercially available adaptive optics system for clinical ophthalmology applications. 
                Features real-time wavefront sensing and high-speed image acquisition.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Research-Grade AO Platform</h4>
                <Badge className="ml-2 bg-[#F2FCE2] text-[#16A34A] border-0 hover:bg-[#F2FCE2]">5 releases</Badge>
              </div>
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
