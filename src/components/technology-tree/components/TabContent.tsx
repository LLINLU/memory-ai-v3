
import React from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { FilterSort } from "../FilterSort";
import { TabNavigator } from "./TabNavigator";
import { Separator } from "@/components/ui/separator";

interface TabContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

export const TabContent = ({ 
  activeTab, 
  onValueChange
}: TabContentProps) => {
  return (
    <>
      <Separator className="my-4" />
      <div className="flex items-center justify-between mb-6">
        <TabNavigator onValueChange={onValueChange} />
        <FilterSort className="justify-end" />
      </div>
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
