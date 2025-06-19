import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Code, Loader2 } from "lucide-react";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
  papersCount?: number;
  useCasesCount?: number;
  loadingPapers?: boolean;
  loadingUseCases?: boolean;
}

export const TabNavigator = ({
  onValueChange,
  papersCount = 0,
  useCasesCount = 0,
  loadingPapers = false,
  loadingUseCases = false,
}: TabNavigatorProps) => {
  return (
    <Tabs
      defaultValue="papers"
      className="w-auto"
      onValueChange={onValueChange}
    >
      <TabsList className="border-gray-200 gap-6 h-auto p-0 bg-transparent">        <TabsTrigger
          value="papers"
          className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-600"
        >
          {loadingPapers ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          論文 {loadingPapers ? "(生成中...)" : `(${papersCount})`}
        </TabsTrigger>
        <TabsTrigger
          value="implementation"
          className="flex items-center data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-0 py-2 rounded-none bg-transparent text-gray-600 hover:text-blue-600"
        >
          {loadingUseCases ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Code className="w-4 h-4 mr-2" />
          )}
          事例 {loadingUseCases ? "(生成中...)" : `(${useCasesCount})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
