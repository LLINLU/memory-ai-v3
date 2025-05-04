
import React from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { SelectedNodeInfo } from "./SelectedNodeInfo";
import { FilterSort } from "../FilterSort";
import { TabNavigator } from "./TabNavigator";
import { ExternalLink, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabContentProps {
  activeTab: string;
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
  onValueChange: (value: string) => void;
}

export const TabContent = ({ 
  activeTab, 
  selectedNodeTitle, 
  selectedNodeDescription,
  onValueChange
}: TabContentProps) => {
  return (
    <>
      <SelectedNodeInfo 
        title={selectedNodeTitle} 
        description={selectedNodeDescription} 
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">32 papers</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">9 implementations</span>
        </div>
      </div>
      
      <div className="border-b mb-6">
        <TabNavigator onValueChange={onValueChange} />
      </div>
      
      <div className="flex justify-end mb-6 gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ArrowDown className="h-4 w-4" />
          Sort
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
