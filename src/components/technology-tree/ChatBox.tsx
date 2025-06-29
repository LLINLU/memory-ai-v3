
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
  isOpen?: boolean;
  isExpanded?: boolean;
  onToggleOpen?: () => void;
  onToggleExpand?: () => void;
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
  onCheckResults,
  isOpen: externalIsOpen,
  isExpanded: externalIsExpanded,
  onToggleOpen,
  onToggleExpand
}: ChatBoxProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

  // Check if this is a guidance conversation (contains guidance messages)
  const isGuidanceConversation = messages.some(message => 
    message.content && message.content.includes('ツリーマップの使用方法を教えてください')
  );

  const toggleOpen = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const toggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  return (
    <div data-chatbox className="z-50">
      {!isOpen ? (
        <Button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-4 h-14 w-14 z-50"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <div 
          className={`fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col z-50 ${
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
            scrollToTop={isGuidanceConversation}
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
