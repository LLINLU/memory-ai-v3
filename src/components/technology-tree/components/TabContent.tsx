
import React, { useState } from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { SelectedNodeInfo } from "./SelectedNodeInfo";
import { TabNavigator } from "./TabNavigator";
import { ExternalLink, Filter, ArrowDown, ArrowUp, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setFilterType(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  return (
    <>
      <SelectedNodeInfo 
        title={selectedNodeTitle} 
        description={selectedNodeDescription} 
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">32 papers</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">9 implementations</span>
        </div>
      </div>
      
      <div className="border-b mb-6">
        <TabNavigator onValueChange={onValueChange} />
      </div>
      
      <div className="flex justify-end mb-6 gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem
              checked={filterType.includes("review")}
              onCheckedChange={() => toggleFilter("review")}
            >
              Review Papers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType.includes("clinical")}
              onCheckedChange={() => toggleFilter("clinical")}
            >
              Clinical Studies
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType.includes("methods")}
              onCheckedChange={() => toggleFilter("methods")}
            >
              Methods Papers
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterType([])}>
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                Newest First
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Oldest First
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Most Cited
            </DropdownMenuItem>
            <DropdownMenuItem>
              Relevance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      {activeTab === "papers" ? <PaperList /> : <ImplementationList />}
    </>
  );
};
