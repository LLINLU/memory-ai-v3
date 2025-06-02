
import React, { useEffect } from "react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { LoadingIndicator } from "./chat/LoadingIndicator";
import { useRefinementChat } from "./hooks/useRefinementChat";

interface RefinementChatProps {
  initialQuery: string;
  onRefinementComplete: (context: any) => void;
  onContextUpdate?: (context: any) => void;
}

export const RefinementChat = ({ 
  initialQuery, 
  onRefinementComplete,
  onContextUpdate 
}: RefinementChatProps) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleButtonClick,
    handleSendMessage,
    initializeConversation
  } = useRefinementChat(initialQuery, onRefinementComplete, onContextUpdate);

  useEffect(() => {
    initializeConversation();
  }, [initialQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
            buttons={message.buttons}
            onButtonClick={handleButtonClick}
          />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
