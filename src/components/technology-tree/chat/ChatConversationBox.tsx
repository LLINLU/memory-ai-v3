
import React, { useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            
            return (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
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
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
