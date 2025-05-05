
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { NodeSuggestion } from "@/types/chat";

interface ChatConversationBoxProps {
  messages: any[];
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
}

export const ChatConversationBox = ({
  messages,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine
}: ChatConversationBoxProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-gray-500 text-sm">Ask a question about your research topic...</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const isActionTaken = nextMessage && nextMessage.content === "The node has been created 😊";
          
          return (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <ChatMessage 
                message={message}
                isActionTaken={isActionTaken}
                onButtonClick={onButtonClick}
                onUseNode={onUseNode}
                onEditNode={onEditNode}
                onRefine={onRefine}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
