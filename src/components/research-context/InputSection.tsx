
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Compass, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
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
        <ToggleGroup 
          type="single" 
          value={searchMode}
          onValueChange={handleSearchModeChange}
          className="bg-blue-50 p-1 rounded-full border border-gray-100"
        >
          <ToggleGroupItem 
            value="quick" 
            aria-label="Quick Exploration"
            className="data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm rounded-full px-3 py-1 text-sm"
          >
            <Compass className="h-4 w-4 mr-1" /> Quick Exploration
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="deep" 
            aria-label="Deep Search"
            className="data-[state=on]:bg-white data-[state=on]:text-blue-600 data-[state=on]:shadow-sm rounded-full px-3 py-1 text-sm"
          >
            <Search className="h-4 w-4 mr-1" /> Deep Search
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          className="w-full resize-none p-3 pr-16 border rounded-xl text-base"
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
