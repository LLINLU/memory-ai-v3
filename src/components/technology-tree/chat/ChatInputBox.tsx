
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search } from "lucide-react";

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
            className={`inline-flex items-center rounded-full py-1 px-5 h-[22px] text-blue-600 transition-colors ${
              searchMode === "quick" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none" className="mr-1">
              <path d="M14.2611 4.11406C13.8369 3.38281 12.6791 3.23515 10.9072 3.67519C10.0956 3.03474 9.11996 2.63588 8.09212 2.5243C7.06428 2.41272 6.0258 2.59295 5.09565 3.04432C4.16551 3.49569 3.38133 4.19996 2.83296 5.07643C2.28459 5.9529 1.99421 6.96612 1.9951 8C1.99513 8.25481 2.01275 8.50933 2.04783 8.76172C0.766972 10.073 0.3158 11.1512 0.741777 11.8859C1.00545 12.3406 1.56209 12.5709 2.3742 12.5709C2.86774 12.5624 3.3589 12.5003 3.83904 12.3857C3.924 12.367 4.01014 12.3459 4.09744 12.3271C4.96064 13.0075 6.00775 13.414 7.10394 13.4941C8.20012 13.5742 9.2952 13.3243 10.2481 12.7766C11.2011 12.229 11.9683 11.4086 12.4509 10.4211C12.9336 9.43364 13.1095 8.3243 12.9562 7.23594C13.6974 6.47422 14.1931 5.75234 14.3543 5.15C14.4586 4.7498 14.4281 4.40176 14.2611 4.11406ZM7.49998 3.19531C8.60016 3.19682 9.66659 3.57531 10.5216 4.26769C11.3766 4.96008 11.9684 5.92455 12.1986 7.00039C11.2611 7.89687 9.96385 8.85605 8.48963 9.70273C6.88416 10.6262 5.43689 11.2227 4.26853 11.5508C3.55261 10.8982 3.05068 10.0444 2.82861 9.10142C2.60653 8.15847 2.67468 7.17042 3.02412 6.2669C3.37355 5.36337 3.98795 4.58658 4.7867 4.03843C5.58545 3.49029 6.53124 3.19639 7.49998 3.19531ZM1.34764 11.5332C1.14139 11.1775 1.48299 10.4457 2.22654 9.59961C2.46992 10.3993 2.8921 11.133 3.46111 11.7453C2.30975 11.9691 1.54627 11.8719 1.34764 11.5332ZM7.49998 12.8047C6.60149 12.8056 5.72102 12.5527 4.95994 12.0752C6.17166 11.682 7.51228 11.0756 8.84002 10.3127C10.1777 9.54394 11.3672 8.6914 12.3 7.85703C12.3 7.90449 12.3035 7.95195 12.3035 8C12.3023 9.2737 11.7958 10.4949 10.8953 11.3956C9.99475 12.2964 8.77368 12.8031 7.49998 12.8047ZM13.6728 4.96543C13.5627 5.37558 13.2463 5.87304 12.7728 6.40742C12.5297 5.60588 12.1069 4.8704 11.5365 4.25703C12.4635 4.07832 13.4115 4.05254 13.6529 4.46679C13.7226 4.58691 13.7291 4.75508 13.6728 4.96543Z" fill="currentColor"/>
            </svg>
            Quick Exploration
          </button>
          <button 
            type="button"
            onClick={() => handleSearchModeChange("deep")}
            className={`inline-flex items-center rounded-full py-1 px-5 h-[22px] text-blue-600 transition-colors ${
              searchMode === "deep" ? "bg-blue-50" : "bg-transparent hover:bg-gray-100"
            }`}
          >
            <Search className="h-4 w-4 mr-1" /> Deep Search
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
