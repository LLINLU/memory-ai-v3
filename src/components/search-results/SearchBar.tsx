
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp, Target, Lightbulb } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation } from "react-router-dom";

export const SearchBar = () => {
  const [searchMode, setSearchMode] = useState("TED"); // Default to "TED"
  const [searchValue, setSearchValue] = useState("補償光学の眼科分野への利用 (Adaptive Optics in Ophthalmology)");
  const location = useLocation();
  
  // Only show search mode selector on homepage
  const isHomepage = location.pathname === "/";
  
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
            placeholder={searchMode === "FAST" ? 
              "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
              ""}
            className="w-full px-4 py-3 text-base border-none bg-gray-50 focus-visible:ring-0 truncate"
          />
          
          {isHomepage && (
            <div className="flex mt-2 items-center">
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        onClick={() => handleSearchModeChange("TED")}
                        className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                          searchMode === "TED" ? "bg-blue-50 text-blue-700" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                        }`}
                      >
                        <Target className={`h-3 w-3 mr-1 ${searchMode === "TED" ? "stroke-[2.5px]" : ""}`} />
                        ニーズからはじめる
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">社会課題やニーズを起点に、「シナリオ → 目的 → 機能 → 手段」のフレームで解決する可能性のある技術テーマを探索します。</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        onClick={() => handleSearchModeChange("FAST")}
                        className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                          searchMode === "FAST" ? "bg-purple-50 text-purple-700" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                        }`}
                      >
                        <Lightbulb className={`h-3 w-3 mr-1 ${searchMode === "FAST" ? "stroke-[2.5px]" : ""}`} />
                        技術からはじめる
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">注目技術を軸に、「How1 → How2 → How3 …」と段階的に技術要素を深掘り。実装に必要な要素技術やアプローチを体系的に整理します。</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="ml-auto">
                <Button className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
                  <ArrowUp className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
