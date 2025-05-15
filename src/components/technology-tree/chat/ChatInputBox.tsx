
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Sparkles } from "lucide-react";
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
    <div className="border-t border-gray-100 p-3 bg-white">
      <div className="flex flex-col gap-2">
        <Textarea 
          placeholder="Ask a question about your research topic..."
          className="w-full resize-none border rounded-lg text-sm py-3 px-4 min-h-[50px] max-h-[120px]"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          autoResize
        />
        
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-blue-500 border-blue-100 bg-blue-50 hover:bg-blue-100"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                Quick Feature
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-lg rounded-md w-64">
              <DropdownMenuItem 
                className="py-2 cursor-pointer hover:bg-blue-50"
                onClick={() => handleDropdownAction('generate-node')}
              >
                Treemapを調整する
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="py-2 cursor-pointer hover:bg-blue-50"
                onClick={() => handleDropdownAction('modify-scenario')}
              >
                研究シナリオを修正
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className={cn(
              "bg-blue-500 hover:bg-blue-600 text-white rounded-full p-0 w-10 h-10 flex items-center justify-center",
              "transition-colors"
            )}
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
          >
            <ArrowUp 
              className="h-5 w-5 transition-colors group-hover:text-[#1867cc]" 
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
