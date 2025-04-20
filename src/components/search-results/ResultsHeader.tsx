
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const ResultsHeader = () => {
  return (
    <div className="container mx-auto px-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl font-bold">32 Relevant Results</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Filter by:</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100">
                  Past 5 years <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white">
                <DropdownMenuItem>Past 5 years</DropdownMenuItem>
                <DropdownMenuItem>Past year</DropdownMenuItem>
                <DropdownMenuItem>2024</DropdownMenuItem>
                <DropdownMenuItem>Before 2020</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border rounded-md px-4 py-2 ml-2 bg-gray-50 hover:bg-gray-100">
                  50+ Citations <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white">
                <DropdownMenuItem>Any Citations</DropdownMenuItem>
                <DropdownMenuItem>10+ Citations</DropdownMenuItem>
                <DropdownMenuItem>50+ Citations</DropdownMenuItem>
                <DropdownMenuItem>100+ Citations</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2">
                  Newest First <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>Most Relevant</DropdownMenuItem>
                <DropdownMenuItem>Most Citations</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
