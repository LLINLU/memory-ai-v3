
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

interface SuggestionProps {
  label: string;
}

const SearchSuggestion = ({ label }: SuggestionProps) => {
  return (
    <button className="bg-white hover:bg-gray-50 rounded-full px-6 py-2.5 text-gray-700 transition-colors text-sm border border-gray-200">
      {label}
    </button>
  );
};

export const SearchSection = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('/research-context', { state: { query: searchValue } });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Discover Research and Applications</h1>
      
      <form onSubmit={handleSubmit} className="w-full mx-auto mb-8">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="e.g.補償光学の眼科分野への利用"
            className="w-full h-16 pl-6 pr-14 text-lg rounded-2xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-400"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!searchValue.trim()}
          >
            <ArrowUp className="h-6 w-6 text-blue-600" />
          </Button>
        </div>
      </form>
      
      <div className="flex items-center gap-3 justify-center">
        <span className="text-gray-600 text-sm">Try:</span>
        <div className="flex gap-2">
          <SearchSuggestion label="Solid state batteries" />
          <SearchSuggestion label="Quantum computing" />
          <SearchSuggestion label="Sustainable materials" />
        </div>
      </div>
    </div>
  );
};
