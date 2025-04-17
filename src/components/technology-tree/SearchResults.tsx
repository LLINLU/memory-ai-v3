
import React, { useEffect } from "react";
import { PaperList } from "./PaperList";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";
import { ImplementationList } from "./ImplementationList";

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
      <h3 className="text-xl font-bold mb-4">Results</h3>
      
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
          <ImplementationList />
        )}
      </Tabs>
    </div>
  );
};
