
import React from 'react';
import { Button } from "@/components/ui/button";
import { NodeSuggestion } from "@/types/chat";
import { SuggestionActions } from './SuggestionActions';
import { cn } from "@/lib/utils";
import { Edit, MessageCircle } from "lucide-react";

interface ChatMessageProps {
  message: {
    content: string | string[];
    isUser: boolean;
    type?: string;
    suggestion?: NodeSuggestion;
    buttons?: {
      label: string;
      action: string;
      primary?: boolean;
    }[];
    isGroup?: boolean;
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
  const isSkipped = message.isUser && message.content === "Skipped";
  
  // Render multiple messages if content is an array
  const renderContent = () => {
    if (Array.isArray(message.content)) {
      return message.content.map((content, i) => (
        <p key={i} className="text-base mb-2 whitespace-pre-line">{content}</p>
      ));
    }
    return <p className={cn(
      "whitespace-pre-line",
      message.type === 'welcome' ? 'text-lg text-gray-800 mb-6 font-medium' : 'text-base'
    )}>
      {message.content}
    </p>;
  };

  // Special handling for welcome message with node creation options
  const renderWelcomeOptions = () => {
    if (message.type === 'welcome' && message.content.includes('新しいノードを')) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👋</span>
            <h2 className="text-lg font-medium text-gray-800">こんにちは！新しいノードをレベル2に追加しましょう！</h2>
          </div>
          
          <p className="text-gray-600 text-base mb-6">2つの簡単な方法があります：</p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onButtonClick && onButtonClick('direct-input')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto text-left flex flex-col items-start gap-1 rounded-xl"
            >
              <span className="font-medium text-base">タイトルと説明を入力</span>
              <span className="text-blue-100 text-sm font-normal">タイトルと説明をそのまま教えてください</span>
            </Button>

            <Button
              onClick={() => onButtonClick && onButtonClick('idea-sharing')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto text-left flex flex-col items-start gap-1 rounded-xl"
            >
              <span className="font-medium text-base">アイデアを話す</span>
              <span className="text-blue-100 text-sm font-normal">内容を整理してタイトルと説明を提案します</span>
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div 
      className={cn(
        "inline-block w-full max-w-full",
        message.type === 'welcome' && "w-full" 
      )}
    >
      {message.isUser ? (
        <div className={cn(
          "rounded-xl p-4 mb-4",
          isSkipped ? "ml-auto bg-blue-50 px-4 py-2" : "border border-gray-200 bg-white"
        )}>
          {isSkipped ? (
            <span className="text-blue-700 font-medium whitespace-nowrap">スキップ</span>
          ) : (
            renderContent()
          )}
        </div>
      ) : (
        <div className={cn(
          "rounded-xl p-4 mb-4",
          message.type === 'welcome' 
            ? "bg-blue-50 w-full border border-blue-100" 
            : "bg-blue-50 text-blue-900"
        )}>
          {message.type === 'welcome' && message.content.includes('新しいノードを') ? (
            renderWelcomeOptions()
          ) : (
            <>
              {renderContent()}
              
              {message.suggestion && !isActionTaken && (
                <SuggestionActions 
                  suggestion={message.suggestion}
                  onUseNode={onUseNode}
                  onEditNode={onEditNode}
                  onRefine={onRefine}
                />
              )}
              
              {message.buttons && (
                <div className="flex flex-col sm:flex-row gap-3 justify-start mt-3">
                  {message.buttons.map((button, buttonIndex) => (
                    <Button
                      key={buttonIndex}
                      onClick={() => onButtonClick && onButtonClick(button.action)}
                      className={cn(
                        button.primary
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      )}
                      size="sm"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
