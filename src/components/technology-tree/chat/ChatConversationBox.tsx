
import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { NodeSuggestion } from "@/types/chat";
import { MessagesList } from './MessagesList';
import { WelcomeMessage } from './WelcomeMessage';
import { useMessageVisibility } from './useMessageVisibility';
import { useMessageGrouping } from './useMessageGrouping';

interface ChatConversationBoxProps {
  messages: any[];
  onButtonClick?: (action: string, levelNumber?: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  onResearchAreaVisible?: (isVisible: boolean) => void;
  inputValue?: string;
  isNodeCreation?: boolean;
  levelNumber?: string;
}

export const ChatConversationBox = ({
  messages,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults,
  onResearchAreaVisible,
  inputValue = '',
  isNodeCreation = false,
  levelNumber
}: ChatConversationBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Custom hooks
  const { researchAreaElements } = useMessageVisibility(messages, onResearchAreaVisible);
  const { filteredMessages, hasSubstantiveMessages } = useMessageGrouping(messages, isNodeCreation);
  
  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle button click to navigate to technology tree or call the provided handler
  const handleCheckResults = () => {
    if (onCheckResults) {
      onCheckResults();
    } else {
      // If no handler provided, navigate directly
      navigate('/technology-tree');
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('ChatConversationBox - Level number:', levelNumber);
    console.log('ChatConversationBox - Messages:', filteredMessages);
    console.log('ChatConversationBox - Has substantive messages:', hasSubstantiveMessages);
  }, [levelNumber, filteredMessages, hasSubstantiveMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white relative">
      {/* Only show welcome message if there are no substantive messages AND we have an onButtonClick handler */}
      {!hasSubstantiveMessages && onButtonClick && (
        <WelcomeMessage
          inputValue={inputValue}
          onButtonClick={(action) => onButtonClick(action, levelNumber)}
        />
      )}
      
      {/* Display all filtered messages */}
      <MessagesList 
        messages={filteredMessages} 
        onButtonClick={onButtonClick}
        onUseNode={onUseNode}
        onEditNode={onEditNode}
        onRefine={onRefine}
        handleCheckResults={handleCheckResults}
        levelNumber={levelNumber}
      />
      
      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};
