
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Maximize2, Minimize2, MessageSquare, X } from "lucide-react";

interface ChatBoxProps {
  messages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
}

export const ChatBox = ({
  messages = [],
  inputValue,
  onInputChange,
  onSendMessage
}: ChatBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSend = () => {
    if (onSendMessage && inputValue.trim()) {
      onSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-4 h-14 w-14"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col ${
        isExpanded ? 'w-[500px] h-[600px]' : 'w-[350px] h-[450px]'
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <h3 className="font-medium text-gray-800">AI Research Assistant</h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleExpand}
            className="h-8 w-8"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleOpen}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mb-2 text-gray-400" />
            <p className="mb-1">Ask the AI Research Assistant</p>
            <p className="text-sm">Get help finding relevant papers, analyzing research, or understanding difficult concepts</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div 
                className={`inline-block max-w-[85%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="border-t border-gray-200 p-3">
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
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            Send <Send className="h-3 w-3 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
