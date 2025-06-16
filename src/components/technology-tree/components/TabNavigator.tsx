import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Code } from "lucide-react";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
  papersCount?: number;
  useCasesCount?: number;
}

export const TabNavigator = ({
  onValueChange,
  papersCount = 0,
  useCasesCount = 0,
}: TabNavigatorProps) => {
  return (
    <Tabs
      defaultValue="papers"
      className="w-auto"
      onValueChange={onValueChange}
    >
      <TabsList className="border-gray-200 gap-6 h-auto p-0 bg-transparent">
        <TabsTrigger
          value="papers"
          className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-600"
        >
          <FileText className="w-4 h-4 mr-2" />
          論文 ({papersCount})
        </TabsTrigger>
        {/* 🚫 TEMPORARILY DISABLED - Use Cases API not production ready */}
        {/* 
        <TabsTrigger
          value="implementation"
          className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-600"
        >
          <Code className="w-4 h-4 mr-2" />
          事例 ({useCasesCount})
        </TabsTrigger>
        */}
      </TabsList>
    </Tabs>
  );
};
