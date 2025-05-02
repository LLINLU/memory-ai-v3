
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
        title={selectedNodeTitle || "Retinal Imaging"} 
        description={selectedNodeDescription || "A non-invasive technique that captures detailed images of the retina—the light-sensitive tissue at the back of the eye."} 
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">32 papers • 9 implementations</span>
        <FilterSort className="justify-end" />
      </div>
      <TabNavigator onValueChange={onValueChange} />
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
