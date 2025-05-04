
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
}

export const TabNavigator = ({ onValueChange }: TabNavigatorProps) => {
  return (
    <Tabs defaultValue="papers" className="w-full" onValueChange={onValueChange}>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="papers" className="flex-1">
          <Book className="w-4 h-4 mr-2" />
          Papers
        </TabsTrigger>
        <TabsTrigger value="implementation" className="flex-1">
          <Code className="w-4 h-4 mr-2" />
          Implementation
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
