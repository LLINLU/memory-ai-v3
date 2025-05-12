
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, Search } from "lucide-react";

export const SearchBar = () => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="container mx-auto">
        <div className="mb-2">
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={() => handleSearchModeChange("quick")}
              className={`inline-flex items-center rounded-full py-1 px-5 h-[22px] text-blue-600 transition-colors ${
                searchMode === "quick" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
              }`}
            >
              <Compass className="h-4 w-4 mr-1" /> Quick Exploration
            </button>
            <button 
              type="button"
              onClick={() => handleSearchModeChange("deep")}
              className={`inline-flex items-center rounded-full py-1 px-5 h-[22px] text-blue-600 transition-colors ${
                searchMode === "deep" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
              }`}
            >
              <Search className="h-4 w-4 mr-1" /> Deep Search
            </button>
          </div>
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
