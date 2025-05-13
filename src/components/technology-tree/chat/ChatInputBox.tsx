
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
    <div className="border-t border-gray-200 p-3">
      <Textarea 
        placeholder="Ask a question about your research topic..."
        className="w-full resize-none border border-[#ebf0f7] focus-visible:ring-1 focus-visible:ring-blue-500 text-sm px-3 py-2 truncate"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        rows={1}
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
