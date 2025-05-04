
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
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <TabNavigator onValueChange={onValueChange} />
        <FilterSort className="justify-end" />
      </div>
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
