
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { ExternalLink, Filter, ArrowDown, ArrowUp, SortAsc, SortDesc } from "lucide-react";

interface TabNavigatorProps {
  onValueChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  filterType: string[];
  setSortOrder: (order: "asc" | "desc") => void;
  toggleFilter: (value: string) => void;
  setFilterType: (types: string[]) => void;
}

export const TabNavigator = ({ 
  onValueChange,
  sortOrder,
  filterType,
  setSortOrder,
  toggleFilter,
  setFilterType
}: TabNavigatorProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs defaultValue="papers" onValueChange={onValueChange} className="flex-1">
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
      
      <div className="flex items-center gap-3">
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
    </div>
  );
};
