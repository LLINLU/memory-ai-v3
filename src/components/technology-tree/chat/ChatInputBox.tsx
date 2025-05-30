
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ChatInputBoxProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onButtonClick?: (action: string) => void;
}

export const ChatInputBox = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onButtonClick
}: ChatInputBoxProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleDropdownAction = (action: string) => {
    if (onButtonClick) {
      onButtonClick(action);
    }
    
    // If action is to adjust the treemap, also trigger the node creation flow via DOM
    if (action === 'generate-node') {
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox) {
        chatbox.setAttribute('data-node-creation', 'true');
      }
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-b-2xl">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Textarea 
            placeholder="Ask a question about your research topic..."
            className={cn(
              "w-full resize-none border-2 rounded-xl text-sm py-4 px-4 min-h-[60px] max-h-[120px]",
              "transition-all duration-200 ease-in-out",
              "focus:ring-0 focus:ring-offset-0",
              isFocused 
                ? "border-blue-300 bg-white shadow-md" 
                : "border-gray-200 bg-gray-50/50",
              "placeholder:text-gray-400"
            )}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            autoResize
          />
        </div>
        
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center gap-2 text-blue-600 border-blue-200 bg-blue-50/50",
                  "hover:bg-blue-100 transition-all duration-200",
                  "hover:scale-105 active:scale-95 rounded-lg"
                )}
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                Quick Feature
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl w-72"
            >
              <DropdownMenuItem 
                className="py-3 cursor-pointer hover:bg-blue-50 rounded-lg mx-1"
                onClick={() => handleDropdownAction('generate-node')}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Treemapを調整する</span>
                  <span className="text-xs text-gray-500">新しいノードを追加または編集</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="py-3 cursor-pointer hover:bg-blue-50 rounded-lg mx-1"
                onClick={() => handleDropdownAction('modify-scenario')}
              >
                <div className="flex flex-col">
                  <span className="font-medium">研究シナリオを修正</span>
                  <span className="text-xs text-gray-500">現在のシナリオを改善</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className={cn(
              "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
              "text-white rounded-full p-0 w-12 h-12 flex items-center justify-center",
              "transition-all duration-200 ease-in-out shadow-lg",
              "hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100",
              inputValue.trim() ? "hover:shadow-xl" : ""
            )}
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
          >
            <ArrowUp 
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                inputValue.trim() ? "scale-110" : "scale-100"
              )} 
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
