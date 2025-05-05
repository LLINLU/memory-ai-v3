
import React from 'react';
import { Button } from "@/components/ui/button";
import { NodeSuggestion } from "@/types/chat";
import { SuggestionActions } from './SuggestionActions';

interface ChatMessageProps {
  message: {
    content: string;
    isUser: boolean;
    type?: string;
    suggestion?: NodeSuggestion;
    buttons?: {
      label: string;
      action: string;
      primary?: boolean;
    }[];
  };
  isActionTaken: boolean;
  onButtonClick?: (action: string) => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
}

export const ChatMessage = ({
  message,
  isActionTaken,
  onButtonClick,
  onUseNode,
  onEditNode,
  onRefine
}: ChatMessageProps) => {
  return (
    <div 
      className={`inline-block max-w-[85%] ${
        message.type === 'welcome' 
          ? 'w-full' 
          : ''
      } ${
        message.isUser 
          ? 'bg-blue-100 text-blue-900 p-3 rounded-lg' 
          : message.type === 'welcome'
            ? 'bg-blue-50 p-4 rounded-xl w-full'
            : 'bg-white border border-gray-200 text-gray-800 p-3 rounded-lg'
      }`}
    >
      <p className={`${message.type === 'welcome' ? 'text-lg text-blue-800 mb-4' : 'text-sm'} whitespace-pre-line`}>
        {message.content}
      </p>
      
      {message.suggestion && !isActionTaken && (
        <SuggestionActions 
          suggestion={message.suggestion}
          onUseNode={onUseNode}
          onEditNode={onEditNode}
          onRefine={onRefine}
        />
      )}
      
      {message.buttons && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
          {message.buttons.map((button, buttonIndex) => (
            <Button
              key={buttonIndex}
              onClick={() => onButtonClick && onButtonClick(button.action)}
              className={`${
                button.primary
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              } px-4 py-2`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
