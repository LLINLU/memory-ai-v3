
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { NodeSuggestion } from "@/types/chat";
import { Button } from "@/components/ui/button";

interface MessagesListProps {
  messages: any[];
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  handleCheckResults: () => void;
}

export const MessagesList = ({
  messages,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine,
  handleCheckResults
}: MessagesListProps) => {
  // Function to check if a message contains the 潜在的な研究分野 section
  const isPotentialResearchFieldMessage = (message: any) => {
    return message.content && typeof message.content === 'string' && 
      message.content.includes('潜在的な研究分野');
  };

  return (
    <div className="space-y-1">
      {messages.map((message, index) => {
        const nextMessage = messages[index + 1];
        const isActionTaken = nextMessage && nextMessage.content === "ノードが作成されました 😊";
        const isResearchFieldSection = isPotentialResearchFieldMessage(message);
        
        // Skip rendering welcome messages if they're in the message list
        if (message.content?.includes('何かお手伝いできることはありますか') && index === 0) {
          return null;
        }
        
        return (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} ${isResearchFieldSection ? 'conversation-message' : ''}`}
          >
            <div className={`${message.isUser ? '' : 'max-w-[85%] w-full'}`}>
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
    </div>
  );
};
