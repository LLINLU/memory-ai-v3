
import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { NodeSuggestion } from "@/types/chat";
import { MessagesList } from './MessagesList';
import { WelcomeMessage } from './WelcomeMessage';
import { useMessageVisibility } from './useMessageVisibility';
import { useMessageGrouping } from './useMessageGrouping';
import { cn } from "@/lib/utils";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Custom hooks
  const { researchAreaElements } = useMessageVisibility(messages, onResearchAreaVisible);
  const { filteredMessages, hasSubstantiveMessages } = useMessageGrouping(messages, isNodeCreation);
  
  // Function to scroll to bottom with smooth animation
  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      
      // Smooth scroll animation
      const startScrollTop = container.scrollTop;
      const distance = maxScrollTop - startScrollTop;
      const duration = 300;
      const startTime = performance.now();
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollTop = startScrollTop + (distance * easeOutQuart);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
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
    <div 
      ref={scrollContainerRef}
      className={cn(
        "flex-1 overflow-y-auto p-5 bg-gradient-to-b from-white to-gray-50/30",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        "relative custom-scrollbar"
      )}
      style={{
        scrollBehavior: 'smooth'
      }}
    >
      {/* Only show welcome message if there are no substantive messages */}
      {!hasSubstantiveMessages && onButtonClick && (
        <div className="mb-6">
          <WelcomeMessage
            inputValue={inputValue}
            onButtonClick={onButtonClick}
          />
        </div>
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
      <div ref={messagesEndRef} className="h-4" />
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
};
