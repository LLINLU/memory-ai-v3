
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Compass, Search } from "lucide-react";

export const SearchBar = () => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
  };
  
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="container mx-auto">
        <div className="mb-2">
          <ToggleGroup 
            type="single" 
            value={searchMode}
            onValueChange={handleSearchModeChange}
            className="bg-blue-50 p-1 rounded-full border border-gray-100"
          >
            <ToggleGroupItem 
              value="quick" 
              aria-label="Quick Exploration"
              className="data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm rounded-full px-3 py-1 text-sm"
            >
              <Compass className="h-4 w-4 mr-1" /> Quick Exploration
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="deep" 
              aria-label="Deep Search"
              className="data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm rounded-full px-3 py-1 text-sm"
            >
              <Search className="h-4 w-4 mr-1" /> Deep Search
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            defaultValue="補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)"
            className="flex-1 h-12"
          />
          <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
