
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
      
      <form onSubmit={handleSubmit} className="w-full mx-auto mb-8">
        <div className="relative">
          <div className="absolute left-3 top-2 z-10">
            <button 
              type="button"
              onClick={() => handleSearchModeChange("quick")}
              className={`inline-flex items-center rounded-full py-1 px-5 h-[32px] text-blue-600 transition-colors ${
                searchMode === "quick" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
              }`}
            >
              <ExplorationIcon className="mr-1" />
              Quick Exploration
            </button>
          </div>
          
          <Input 
            type="text" 
            placeholder="例：補償光学の眼科分野への利用"
            className="w-full h-16 pl-6 pr-14 pt-14 text-lg rounded-2xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-400"
            value={searchValue}
            onChange={handleSearchChange}
          />
          
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bottom-2 h-12 w-12 rounded-xl bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!searchValue.trim()}
          >
            <ArrowUp className="h-6 w-6 text-blue-600" />
          </Button>
        </div>
      </form>
      
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
