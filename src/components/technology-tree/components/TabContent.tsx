
import React from "react";
import { TabNavigator } from "./TabNavigator";

interface TabContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

export const TabContent = ({ 
  activeTab, 
  onValueChange
}: TabContentProps) => {
  return (
    <TabNavigator onValueChange={onValueChange} />
  );
};
