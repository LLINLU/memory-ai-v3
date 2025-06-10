
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation } from "react-router-dom";

export const SearchBar = () => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
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
            placeholder={searchMode === "deep" ? 
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
                        onClick={() => handleSearchModeChange("quick")}
                        className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                          searchMode === "quick" ? "bg-blue-50 text-blue-700" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                        }`}
                      >
                        <ExplorationIcon className={`mr-1 ${searchMode === "quick" ? "stroke-[2.5px]" : ""}`} />
                        Quick Exploration
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">仮説がまだ固まっていない初期段階に最適：「全固体電池」や「女性ホルモン」など一般的なキーワードを入力するだけで、関連技術やトレンドが自動で構造化され、視覚的に表示されます。これにより、自分でも気づいていなかった領域を含め、幅広い探索が可能になります。研究の出発点やアイデア収集に向いています。</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        onClick={() => handleSearchModeChange("deep")}
                        className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                          searchMode === "deep" ? "bg-purple-50 text-purple-700" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                        }`}
                      >
                        <Search className={`h-3 w-3 mr-1 ${searchMode === "deep" ? "stroke-[2.5px]" : ""}`} /> Deep Refiner
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">研究テーマや仮説がある程度明確なときに最適：一般的なキーワードを入力した後、研究者や対象、手法などの詳細を追加することで、情報を的確に絞り込めます。さらに、システムの質問に答えることでコンテキストが洗練され、不要な情報を排除した効率的な探索が可能になります。具体的な研究の仮説があり、技術を深堀りしたいときに特に有効です。</p>
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
