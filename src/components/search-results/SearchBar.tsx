
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";

export const SearchBar = () => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  const [searchValue, setSearchValue] = useState("補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)");
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-2xl p-4">
          <Input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-4 py-3 text-base border-none bg-gray-50 focus-visible:ring-0"
          />
          
          <div className="flex mt-2 items-center">
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => handleSearchModeChange("quick")}
                className={`inline-flex items-center rounded-full py-1 px-5 h-[32px] text-blue-600 transition-colors ${
                  searchMode === "quick" ? "bg-blue-100" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <ExplorationIcon className="mr-1" />
                Quick Exploration
              </button>
              <button 
                type="button"
                onClick={() => handleSearchModeChange("deep")}
                className={`inline-flex items-center rounded-full py-1 px-5 h-[32px] transition-colors ${
                  searchMode === "deep" ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <Search className="h-4 w-4 mr-1" /> Deep Search
              </button>
            </div>
            
            <div className="ml-auto">
              <Button className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
                <ArrowUp className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
