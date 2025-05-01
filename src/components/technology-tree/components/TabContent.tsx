
import React from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { SelectedNodeInfo } from "./SelectedNodeInfo";

interface TabContentProps {
  activeTab: string;
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
}

export const TabContent = ({ activeTab, selectedNodeTitle, selectedNodeDescription }: TabContentProps) => {
  return (
    <>
      <SelectedNodeInfo 
        title={selectedNodeTitle} 
        description={selectedNodeDescription} 
      />
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
