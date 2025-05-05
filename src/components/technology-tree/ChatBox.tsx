
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Maximize2, Minimize2, MessageSquare, X, Check, Edit } from "lucide-react";
import { NodeSuggestion } from "@/types/chat";

interface ChatBoxProps {
  messages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
}

export const ChatBox = ({
  messages = [],
  inputValue,
  onInputChange,
  onSendMessage,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine
}: ChatBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Listen for custom node button clicks
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" && 
          mutation.attributeName === "data-chatbox-open" &&
          (mutation.target as HTMLElement).getAttribute("data-chatbox-open") === "true"
        ) {
          setIsOpen(true);
          // Reset the attribute
          (mutation.target as HTMLElement).removeAttribute("data-chatbox-open");
        }
      });
    });

    const chatboxElement = document.querySelector('[data-chatbox]');
    if (chatboxElement) {
      observer.observe(chatboxElement, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

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

  const renderSuggestionActions = (suggestion: NodeSuggestion) => (
    <div className="flex flex-wrap gap-2 mt-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onUseNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Check className="h-4 w-4" />
        Use this
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEditNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onRefine?.(suggestion)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Refine further
      </Button>
    </div>
  );

  return (
    <div data-chatbox>
      {!isOpen ? (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-4 h-14 w-14"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
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
              messages.map((message, index) => {
                const nextMessage = messages[index + 1];
                const isActionTaken = nextMessage && nextMessage.content === "The node has been created 😊";
                
                return (
                  <div 
                    key={index} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div 
                      className={`inline-block max-w-[85%] ${
                        message.type === 'welcome' 
                          ? 'w-full' 
                          : ''
                      } ${
                        message.isUser 
                          ? 'bg-blue-100 text-blue-900 p-3 rounded-lg' 
                          : message.type === 'welcome'
                            ? 'bg-blue-50 p-4 rounded-xl w-full'
                            : 'bg-white border border-gray-200 text-gray-800 p-3 rounded-lg'
                      }`}
                    >
                      <p className={`${message.type === 'welcome' ? 'text-lg text-blue-800 mb-4' : 'text-sm'} whitespace-pre-line`}>
                        {message.content}
                      </p>
                      
                      {message.suggestion && !isActionTaken && renderSuggestionActions(message.suggestion)}
                      
                      {message.buttons && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                          {message.buttons.map((button: any, buttonIndex: number) => (
                            <Button
                              key={buttonIndex}
                              onClick={() => onButtonClick && onButtonClick(button.action)}
                              className={`${
                                button.primary
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              } px-4 py-2`}
                            >
                              {button.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
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
      )}
    </div>
  );
};
