
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { NodeSuggestion } from "@/types/chat";
import { Button } from "@/components/ui/button";

interface ChatConversationBoxProps {
  messages: any[];
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
}

export const ChatConversationBox = ({
  messages,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults
}: ChatConversationBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to check if a message contains the 潜在的な研究分野 section
  const isPotentialResearchFieldMessage = (message: any) => {
    return message.content && typeof message.content === 'string' && 
      message.content.includes('潜在的な研究分野');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-gray-500 text-sm">Ask a question about your research topic...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message, index) => {
            const nextMessage = messages[index + 1];
            const isActionTaken = nextMessage && nextMessage.content === "ノードが作成されました 😊";
            const isResearchFieldSection = isPotentialResearchFieldMessage(message);
            
            return (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
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
                  {isResearchFieldSection && onCheckResults && (
                    <div className="mt-3 flex justify-center">
                      <Button
                        onClick={onCheckResults}
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
      )}
    </div>
  );
};
