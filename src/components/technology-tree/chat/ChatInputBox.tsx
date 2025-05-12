
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Compass, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ChatInputBoxProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
}

export const ChatInputBox = ({
  inputValue,
  onInputChange,
  onSendMessage
}: ChatInputBoxProps) => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 p-3">
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
      
      <Textarea 
        placeholder="Ask a question about your research..."
        className="w-full resize-none border focus-visible:ring-1 focus-visible:ring-blue-500 text-sm px-3 py-2"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        rows={2}
      />
      
      <div className="flex justify-end pt-2">
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onSendMessage}
          disabled={!inputValue.trim()}
        >
          Send <Send className="h-3 w-3 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
