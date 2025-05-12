
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Search } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";

interface InputSectionProps {
  inputValue: string;
  placeholder: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputValue,
  placeholder,
  onInputChange,
  onSubmit,
  onSkip,
  showSkip = false,
}) => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  return (
    <div className="mt-2">
      {showSkip && (
        <div className="mb-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onSkip}
          >
            スキップ
          </Button>
        </div>
      )}
      <div className="mb-2">
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => handleSearchModeChange("quick")}
            className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
              searchMode === "quick" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
            }`}
          >
            <ExplorationIcon className={`mr-1 ${searchMode === "quick" ? "stroke-[2.5px]" : ""}`} />
            Quick Exploration
          </button>
          <button 
            type="button"
            onClick={() => handleSearchModeChange("deep")}
            className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
              searchMode === "deep" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
            }`}
          >
            <Search className={`h-3 w-3 mr-1 ${searchMode === "deep" ? "stroke-[2.5px]" : ""}`} /> Deep Refiner
          </button>
        </div>
      </div>
      <div className="relative">
        <Textarea
          placeholder={searchMode === "deep" ? 
            "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
            placeholder}
          value={inputValue}
          onChange={onInputChange}
          className="w-full resize-none p-3 pr-16 border rounded-xl text-base truncate"
          rows={2}
        />
        <Button 
          onClick={onSubmit}
          size="sm"
          className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <span>次へ</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
