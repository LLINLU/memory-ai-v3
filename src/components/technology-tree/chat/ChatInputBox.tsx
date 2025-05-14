
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-100 p-3 bg-white">
      <div className="relative">
        <Textarea 
          placeholder="Ask a question about your research topic..."
          className="w-full resize-none border rounded-lg pr-12 text-sm py-3 px-4 min-h-[50px] max-h-[120px]"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        
        <Button 
          className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-0 w-8 h-8 flex items-center justify-center"
          onClick={onSendMessage}
          disabled={!inputValue.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
