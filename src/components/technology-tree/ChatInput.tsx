
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search } from "lucide-react";
import { ExplorationIcon } from "../icons/ExplorationIcon";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: () => void;
}

export const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };
  
  const handleSend = () => {
    if (onSend && value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
      <div className="bg-white">
        <div className="mb-2">
          <div className="flex space-x-2">
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
            <button 
              type="button"
              onClick={() => handleSearchModeChange("deep")}
              className={`inline-flex items-center rounded-full py-1 px-5 h-[32px] text-blue-600 transition-colors ${
                searchMode === "deep" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
              }`}
            >
              <Search className="h-4 w-4 mr-1" /> Deep Search
            </button>
          </div>
        </div>
        
        <Textarea 
          placeholder="メッセージを入力してください..."
          className="w-full resize-none border bg-gray-50 focus-visible:ring-0 text-sm px-4 py-3 rounded-xl"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        
        <div className="flex items-center justify-between px-1 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-2"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            送信 <Send className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
