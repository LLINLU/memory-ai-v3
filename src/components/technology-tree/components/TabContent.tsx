
import React from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  return activeTab === "papers" ? <PaperList /> : <ImplementationList />;
};
