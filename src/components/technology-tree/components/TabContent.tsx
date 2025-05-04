
import React, { useState } from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { SelectedNodeInfo } from "./SelectedNodeInfo";
import { TabNavigator } from "./TabNavigator";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setFilterType(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

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
        <TabNavigator 
          onValueChange={onValueChange} 
          sortOrder={sortOrder}
          filterType={filterType}
          setSortOrder={setSortOrder}
          toggleFilter={toggleFilter}
          setFilterType={setFilterType}
        />
      </div>
      
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
