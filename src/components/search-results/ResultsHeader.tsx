
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
        <h2 className="text-xl font-bold">32件の関連結果</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">フィルター：</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100">
                  過去5年 <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white">
                <DropdownMenuItem>過去5年</DropdownMenuItem>
                <DropdownMenuItem>過去1年</DropdownMenuItem>
                <DropdownMenuItem>2024年</DropdownMenuItem>
                <DropdownMenuItem>2020年以前</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border rounded-md px-4 py-2 ml-2 bg-gray-50 hover:bg-gray-100">
                  引用50+ <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white">
                <DropdownMenuItem>すべての引用</DropdownMenuItem>
                <DropdownMenuItem>引用10+</DropdownMenuItem>
                <DropdownMenuItem>引用50+</DropdownMenuItem>
                <DropdownMenuItem>引用100+</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">並び替え：</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2">
                  新しい順 <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem>新しい順</DropdownMenuItem>
                <DropdownMenuItem>古い順</DropdownMenuItem>
                <DropdownMenuItem>関連性順</DropdownMenuItem>
                <DropdownMenuItem>引用数順</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
