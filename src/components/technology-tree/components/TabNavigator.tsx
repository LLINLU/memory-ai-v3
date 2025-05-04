
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
}

export const TabNavigator = ({ onValueChange }: TabNavigatorProps) => {
  return (
    <Tabs defaultValue="papers" onValueChange={onValueChange} className="w-full">
      <TabsList className="border-b-0 bg-transparent">
        <TabsTrigger 
          value="papers" 
          className="data-[state=active]:border-blue-500 data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-5 py-2 text-base font-medium"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" x2="8" y1="13" y2="13"/>
              <line x1="16" x2="8" y1="17" y2="17"/>
              <line x1="10" x2="8" y1="9" y2="9"/>
            </svg>
            Papers
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="implementations" 
          className="data-[state=active]:border-blue-500 data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-5 py-2 text-base font-medium"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            Implementations
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
