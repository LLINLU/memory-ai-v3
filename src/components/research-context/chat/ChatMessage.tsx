
import React from "react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  buttons?: Array<{
    label: string;
    value: string;
  }>;
  onButtonClick?: (value: string) => void;
}

export const ChatMessage = ({ content, isUser, buttons, onButtonClick }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl p-4 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {buttons && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {buttons.map((button, btnIndex) => (
              <Button
                key={btnIndex}
                variant="outline"
                size="sm"
                onClick={() => onButtonClick?.(button.value)}
                className={isUser ? "border-white text-white hover:bg-white hover:text-blue-600" : ""}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
