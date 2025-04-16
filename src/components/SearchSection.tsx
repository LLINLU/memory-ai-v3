
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SuggestionProps {
  label: string;
}

const SearchSuggestion = ({ label }: SuggestionProps) => {
  return (
    <button className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 transition-colors">
      {label}
    </button>
  );
};

export const SearchSection = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Discover Research and Applications</h2>
      
      <div className="relative w-full max-w-3xl mx-auto mb-6">
        <Input 
          type="text" 
          placeholder="Describe your research interest or technology domain..."
          className="w-full h-12 pr-24 focus-visible:ring-blue-400 border-gray-300"
        />
        <Button 
          type="submit" 
          className="absolute right-0 top-0 h-12 px-8 bg-blue-500 hover:bg-blue-600"
        >
          Search
        </Button>
      </div>
      
      <div className="flex items-center gap-2 justify-center">
        <span className="text-gray-600 mr-2">Try:</span>
        <div className="flex gap-2">
          <SearchSuggestion label="Solid state batteries" />
          <SearchSuggestion label="Quantum computing" />
          <SearchSuggestion label="Sustainable materials" />
        </div>
      </div>
    </div>
  );
};
