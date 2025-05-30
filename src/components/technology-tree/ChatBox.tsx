
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X, ArrowUpRight } from "lucide-react";
import { NodeSuggestion } from "@/types/chat";
import { ChatHeader } from './chat/ChatHeader';
import { ChatConversationBox } from './chat/ChatConversationBox';
import { ChatInputBox } from './chat/ChatInputBox';

interface ChatBoxProps {
  messages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onButtonClick?: (action: string, levelNumber?: string) => void;
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
  const [isNodeCreation, setIsNodeCreation] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Listen for custom node button clicks and switch-to-chat events
  useEffect(() => {
    const handleSwitchToChat = (event: CustomEvent) => {
      if (event.detail?.levelNumber) {
        setIsOpen(true);
        setIsExpanded(true);
        setIsNodeCreation(true);
        
        // Trigger the node creation flow with level information
        if (onButtonClick) {
          onButtonClick('generate-node', event.detail.levelNumber);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          
          // Handle open state
          if (mutation.attributeName === "data-chatbox-open" &&
              target.getAttribute("data-chatbox-open") === "true") {
            setIsOpen(true);
            // Reset the attribute
            target.removeAttribute("data-chatbox-open");
          }
          
          // Handle expanded state
          if (mutation.attributeName === "data-chatbox-expanded" &&
              target.getAttribute("data-chatbox-expanded") === "true") {
            setIsExpanded(true);
            // Reset the attribute
            target.removeAttribute("data-chatbox-expanded");
          }
          
          // Handle node creation mode
          if (mutation.attributeName === "data-node-creation" &&
              target.getAttribute("data-node-creation") === "true") {
            setIsNodeCreation(true);
            // Reset the attribute
            target.removeAttribute("data-node-creation");
            
            // Trigger the node creation flow
            if (onButtonClick) {
              onButtonClick('generate-node');
            }
          }
        }
      });
    });

    // Listen for switch-to-chat custom events
    document.addEventListener('switch-to-chat', handleSwitchToChat);

    const chatboxElement = document.querySelector('[data-chatbox]');
    if (chatboxElement) {
      observer.observe(chatboxElement, { attributes: true });
    }

    return () => {
      document.removeEventListener('switch-to-chat', handleSwitchToChat);
      observer.disconnect();
    };
  }, [onButtonClick]);

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
            isExpanded ? 'w-[500px] h-[600px]' : 'w-[350px] h-[500px]'
          } transition-all duration-200 overflow-hidden`}
        >
          <ChatHeader 
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
            toggleOpen={toggleOpen}
          />
          
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
        </div>
      )}
    </div>
  );
};
