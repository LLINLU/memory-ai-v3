
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X, ArrowUpRight, Minimize2 } from "lucide-react";
import { NodeSuggestion } from "@/types/chat";
import { ChatHeader } from './chat/ChatHeader';
import { ChatConversationBox } from './chat/ChatConversationBox';
import { ChatInputBox } from './chat/ChatInputBox';
import { cn } from "@/lib/utils";

interface ChatBoxProps {
  messages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
}

export const ChatBox = ({
  messages = [],
  inputValue,
  onInputChange,
  onSendMessage,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults
}: ChatBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isNodeCreation, setIsNodeCreation] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // Check if we're in node creation mode based on messages
  useEffect(() => {
    const hasNodeCreationMessage = messages.some(message => 
      message.type === 'welcome' && message.content.includes('新しいノードを')
    );
    setIsNodeCreation(hasNodeCreationMessage);
  }, [messages]);

  // Listen for custom node button clicks
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          
          // Handle open state
          if (mutation.attributeName === "data-chatbox-open" &&
              target.getAttribute("data-chatbox-open") === "true") {
            setIsOpen(true);
            target.removeAttribute("data-chatbox-open");
          }
          
          // Handle expanded state
          if (mutation.attributeName === "data-chatbox-expanded" &&
              target.getAttribute("data-chatbox-expanded") === "true") {
            setIsExpanded(true);
            target.removeAttribute("data-chatbox-expanded");
          }
          
          // Handle node creation mode
          if (mutation.attributeName === "data-node-creation" &&
              target.getAttribute("data-node-creation") === "true") {
            target.removeAttribute("data-node-creation");
            
            // Trigger the node creation flow
            if (onButtonClick) {
              onButtonClick('generate-node');
            }
          }
        }
      });
    });

    const chatboxElement = document.querySelector('[data-chatbox]');
    if (chatboxElement) {
      observer.observe(chatboxElement, { attributes: true });
    }

    return () => observer.disconnect();
  }, [onButtonClick]);

  return (
    <div data-chatbox className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={toggleOpen}
          className={cn(
            "rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
            "shadow-xl hover:shadow-2xl p-4 h-16 w-16 transition-all duration-300 ease-in-out",
            "transform hover:scale-105 active:scale-95"
          )}
        >
          <MessageSquare className="h-7 w-7 text-white" />
        </Button>
      ) : (
        <div 
          className={cn(
            "bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col",
            "transition-all duration-300 ease-in-out transform",
            "backdrop-blur-sm bg-white/95",
            isMinimized ? 'h-16' : isExpanded ? 'w-[600px] h-[700px]' : 'w-[400px] h-[550px]',
            isOpen ? 'animate-scale-in opacity-100' : 'animate-scale-out opacity-0'
          )}
        >
          <ChatHeader 
            isExpanded={isExpanded}
            isMinimized={isMinimized}
            toggleExpand={toggleExpand}
            toggleMinimize={toggleMinimize}
            toggleOpen={toggleOpen}
          />
          
          {!isMinimized && (
            <>
              <ChatConversationBox 
                messages={messages}
                onButtonClick={onButtonClick}
                onUseNode={onUseNode}
                onEditNode={onEditNode}
                onRefine={onRefine}
                onCheckResults={onCheckResults}
                inputValue={inputValue}
                isNodeCreation={isNodeCreation}
              />
              
              <ChatInputBox 
                inputValue={inputValue}
                onInputChange={onInputChange}
                onSendMessage={onSendMessage}
                onButtonClick={onButtonClick}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
