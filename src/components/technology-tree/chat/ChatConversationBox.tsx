
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { NodeSuggestion } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChatConversationBoxProps {
  messages: any[];
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  onResearchAreaVisible?: (isVisible: boolean) => void;
  inputValue?: string;
}

export const ChatConversationBox = ({
  messages,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults,
  onResearchAreaVisible,
  inputValue = ''
}: ChatConversationBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [researchAreaElements, setResearchAreaElements] = useState<HTMLDivElement[]>([]);
  const navigate = useNavigate();
  
  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
    
    // Find all elements that contain the research area section
    setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.conversation-message'))
        .filter(el => el.textContent?.includes('潜在的な研究分野')) as HTMLDivElement[];
      setResearchAreaElements(elements);
    }, 100);
  }, [messages]);
  
  // Track research area visibility
  useEffect(() => {
    if (researchAreaElements.length === 0 || !onResearchAreaVisible) return;
    
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries.some(entry => entry.isIntersecting);
      onResearchAreaVisible(isVisible);
    }, { threshold: 0.3 }); // Consider visible when 30% is visible
    
    researchAreaElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      researchAreaElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, [researchAreaElements, onResearchAreaVisible]);

  // Function to check if a message contains the 潜在的な研究分野 section
  const isPotentialResearchFieldMessage = (message: any) => {
    return message.content && typeof message.content === 'string' && 
      message.content.includes('潜在的な研究分野');
  };

  // Handle button click to navigate to technology tree
  const handleCheckResults = () => {
    if (onCheckResults) {
      onCheckResults();
    } else {
      // If no handler provided, navigate directly
      navigate('/technology-tree');
    }
  };

  const handleCustomButtonClick = (action: string) => {
    if (onButtonClick) {
      onButtonClick(action);
    }
  };

  // Welcome message that shows user's input
  const renderWelcomeMessage = () => {
    const userInput = inputValue || 'query';
    
    return (
      <div className="mb-4 bg-blue-50 rounded-xl p-4">
        <p className="text-[0.875rem] mb-3">「{userInput}」を検索しました。何かお手伝いできることはありますか？</p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => handleCustomButtonClick('generate-scenario')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800"
            size="sm"
          >
            詳細な研究シナリオを生成
          </Button>
          <Button
            onClick={() => handleCustomButtonClick('summarize-trends')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800"
            size="sm"
          >
            最新の研究動向を要約してください
          </Button>
        </div>
      </div>
    );
  };

  // Check if there are any substantive messages (excluding welcome messages)
  const hasSubstantiveMessages = messages.some(m => 
    m.content && !m.content.includes('何かお手伝いできることはありますか')
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
      {/* Only show welcome message if there are no substantive messages */}
      {!hasSubstantiveMessages && renderWelcomeMessage()}
      
      {/* Always display all messages, never hide them */}
      <div className="space-y-6">
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const isActionTaken = nextMessage && nextMessage.content === "ノードが作成されました 😊";
          const isResearchFieldSection = isPotentialResearchFieldMessage(message);
          
          // Skip rendering duplicate welcome messages if they're in the message list
          if (message.content?.includes('何かお手伝いできることはありますか') && !hasSubstantiveMessages && index === 0) {
            return null;
          }
          
          return (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} ${isResearchFieldSection ? 'conversation-message' : ''}`}
            >
              <div className={`${message.isUser ? '' : 'w-full'}`}>
                <ChatMessage 
                  message={message}
                  isActionTaken={isActionTaken}
                  onButtonClick={onButtonClick}
                  onUseNode={onUseNode}
                  onEditNode={onEditNode}
                  onRefine={onRefine}
                />
                
                {/* Add the 検索結果へ button at the bottom of research field section */}
                {isResearchFieldSection && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      onClick={handleCheckResults}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      検索結果へ
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
