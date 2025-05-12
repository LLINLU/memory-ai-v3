
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { ExplorationIcon } from "./icons/ExplorationIcon";

interface SuggestionProps {
  label: string;
  onClick: (query: string) => void;
}

const SearchSuggestion = ({ label, onClick }: SuggestionProps) => {
  return (
    <button 
      className="bg-white hover:bg-gray-50 rounded-full px-6 py-2.5 text-gray-700 transition-colors text-sm border border-gray-200"
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export const SearchSection = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('/research-context', { 
        state: { 
          query: searchValue,
          searchMode: searchMode
        } 
      });
    }
  };

  const handleSuggestionClick = (query: string) => {
    navigate('/research-context', { 
      state: { 
        query,
        searchMode: searchMode
      } 
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">研究情報を俯瞰する</h1>
      
      <div className="w-full mx-auto mb-8">
        <div className="bg-gray-50 rounded-2xl p-4">
          <Input 
            type="text" 
            placeholder={searchMode === "deep" ? 
              "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
              "例：補償光学の眼科分野への利用"}
            className="w-full px-4 py-3 text-lg border-none bg-gray-50 focus-visible:ring-0 placeholder:text-gray-400 truncate"
            value={searchValue}
            onChange={handleSearchChange}
          />
          
          <div className="flex mt-2 items-center">
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => handleSearchModeChange("quick")}
                className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                  searchMode === "quick" ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                }`}
              >
                <ExplorationIcon className={`mr-1 ${searchMode === "quick" ? "stroke-[2.5px]" : ""}`} />
                Quick Exploration
              </button>
              <button 
                type="button"
                onClick={() => handleSearchModeChange("deep")}
                className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                  searchMode === "deep" ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                }`}
              >
                <Search className={`h-3 w-3 mr-1 ${searchMode === "deep" ? "stroke-[2.5px]" : ""}`} /> Deep Refiner
              </button>
            </div>
            
            <div className="ml-auto">
              <Button
                onClick={handleSubmit}
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchValue.trim()}
              >
                <ArrowUp className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 justify-center">
        <span className="text-gray-600 text-sm">試してみる：</span>
        <div className="flex gap-2">
          <SearchSuggestion label="固体電池" onClick={handleSuggestionClick} />
          <SearchSuggestion label="量子コンピューティング" onClick={handleSuggestionClick} />
          <SearchSuggestion label="持続可能な材料" onClick={handleSuggestionClick} />
        </div>
      </div>
    </div>
  );
};
