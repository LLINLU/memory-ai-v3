import React from 'react';
import { Button } from "@/components/ui/button";
import { NodeSuggestion } from "@/types/chat";
import { SuggestionActions } from './SuggestionActions';
import { cn } from "@/lib/utils";

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
  onButtonClick?: (action: string, levelNumber?: string) => void;
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
    
    // Replace the specific text when rendering content
    let content = message.content;
    if (typeof content === 'string') {
      content = content.replace(
        /1️⃣ 選択したアイテムが各レベルの一番上に移動して表示されます。\n2️⃣ 関連するサブカテゴリが次のレベルに表示されます。/g,
        '1️⃣ まず、興味のあるシナリオを選択してください。\n2️⃣ 次に、カードの横にあるボタンをクリックして次のレベルを表示します。'
      );
    }
    
    return <p className={cn(
      "whitespace-pre-line",
      message.type === 'welcome' ? 'text-lg text-blue-800 mb-4' : 'text-base'
    )}>
      {content}
    </p>;
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
            ? "bg-blue-50 w-full" 
            : "bg-blue-50 text-blue-900"
        )}>
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
                  onClick={() => {
                    console.log('Button clicked:', button.action);
                    onButtonClick && onButtonClick(button.action);
                  }}
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                  size="sm"
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
