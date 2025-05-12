
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Compass, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: () => void;
}

export const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSearchModeChange = (value: string) => {
    if (value) setSearchMode(value);
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
