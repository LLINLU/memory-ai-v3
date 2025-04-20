
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";

interface SuggestionProps {
  label: string;
}

const SearchSuggestion = ({ label }: SuggestionProps) => {
  return (
    <button className="bg-gray-50 hover:bg-gray-100 rounded-full px-6 py-3 text-gray-700 transition-colors text-base">
      {label}
    </button>
  );
};

export const SearchSection = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/technology-tree');
  };

  return (
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200">
      <h2 className="text-4xl font-bold text-center mb-10">Discover Research and Applications</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-4">
          <Input 
            type="text" 
            placeholder="Describe your research interest or technology domain..."
            className="flex-grow h-14 text-lg rounded-full bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-500"
          />
          <Button 
            type="submit" 
            className="h-14 px-8 rounded-full bg-blue-500 hover:bg-blue-600 text-lg font-medium"
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </form>
      
      <div className="flex items-center gap-3 justify-center">
        <span className="text-gray-600 text-lg">Try:</span>
        <div className="flex gap-3">
          <SearchSuggestion label="Solid state batteries" />
          <SearchSuggestion label="Quantum computing" />
          <SearchSuggestion label="Sustainable materials" />
        </div>
      </div>
    </div>
  );
};
