
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search } from "lucide-react";
import { ExplorationIcon } from "../../icons/ExplorationIcon";

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
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
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
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => handleSearchModeChange("quick")}
            className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
              searchMode === "quick" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
            }`}
          >
            <ExplorationIcon className="mr-1" />
            Quick Exploration
          </button>
          <button 
            type="button"
            onClick={() => handleSearchModeChange("deep")}
            className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
              searchMode === "deep" ? "bg-blue-50 text-blue-600" : "bg-transparent hover:bg-gray-100 text-[#9f9f9f]"
            }`}
          >
            <Search className="h-3 w-3 mr-1" /> Deep Search
          </button>
        </div>
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
