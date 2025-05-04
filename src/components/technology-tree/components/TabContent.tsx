
import React from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { SelectedNodeInfo } from "./SelectedNodeInfo";
import { FilterSort } from "../FilterSort";
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
  return (
    <>
      <SelectedNodeInfo 
        title={selectedNodeTitle} 
        description={selectedNodeDescription} 
      />
      <div className="flex items-center justify-between mb-4">
        <TabNavigator onValueChange={onValueChange} />
        <FilterSort className="justify-end" />
      </div>
      <div className="text-sm text-gray-600 mb-4">
        32 papers • 9 implementations
      </div>
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
