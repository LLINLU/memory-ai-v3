
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  scrollToTop?: boolean;
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
  scrollToTop = false
}: ChatConversationBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasScrolledManually, setHasScrolledManually] = useState(false);
  
  // Custom hooks
  const { researchAreaElements } = useMessageVisibility(messages, onResearchAreaVisible);
  const { filteredMessages, hasSubstantiveMessages } = useMessageGrouping(messages, false);
  
  // Function to check if user is at bottom
  const checkIfAtBottom = () => {
    if (!scrollContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  // Function to scroll to top
  const scrollToTopFn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      setIsAtBottom(false);
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    
    // Mark that user has manually scrolled if they're not at bottom
    if (!atBottom) {
      setHasScrolledManually(true);
    }
  };

  // Initial scroll behavior and scroll on new messages
  useEffect(() => {
    // For initial load with guidance messages
    if (scrollToTop && !hasScrolledManually && messages.length > 0) {
      setTimeout(() => scrollToTopFn(), 100);
      return;
    }

    // Only auto-scroll to bottom if user is at bottom or hasn't scrolled manually
    if (isAtBottom || !hasScrolledManually) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, scrollToTop]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

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
    <div className="flex-1 overflow-y-auto p-4 bg-white relative" ref={scrollContainerRef}>
      {/* Only show welcome message if there are no substantive messages AND we have an onButtonClick handler */}
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
      
      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-3 h-12 w-12 z-40 transition-all duration-200"
          size="icon"
        >
          <ArrowDown className="h-5 w-5 text-white" />
        </Button>
      )}
      
      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};
