
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
}

export const TabNavigator = ({ onValueChange }: TabNavigatorProps) => {
  return (
    <Tabs defaultValue="papers" className="w-full" onValueChange={onValueChange}>
      <TabsList className="w-full mb-4 border-b border-gray-200 gap-6 h-auto py-0 bg-transparent">
        <TabsTrigger 
          value="papers" 
          className="flex items-center data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-500"
        >
          <Book className="w-5 h-5 mr-2" />
          Papers
        </TabsTrigger>
        <TabsTrigger 
          value="implementation" 
          className="flex items-center data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-500"
        >
          <Code className="w-5 h-5 mr-2" />
          Implementations
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
