
import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { NodeSuggestion } from "@/types/chat";
import { MessagesList } from './MessagesList';
import { WelcomeMessage } from './WelcomeMessage';
import { useMessageVisibility } from './useMessageVisibility';
import { useMessageGrouping } from './useMessageGrouping';

interface ChatConversationBoxProps {
  messages: any[];
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  onResearchAreaVisible?: (isVisible: boolean) => void;
  inputValue?: string;
  isNodeCreation?: boolean;
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
  isNodeCreation = false
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

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white relative">
      {/* Only show welcome message if there are no substantive messages */}
      {!hasSubstantiveMessages && onButtonClick && (
        <WelcomeMessage
          inputValue={inputValue}
          onButtonClick={onButtonClick}
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
      />
      
      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};
