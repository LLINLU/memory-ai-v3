
import React from 'react';
import { Button } from "@/components/ui/button";
import { NodeSuggestion } from "@/types/chat";
import { SuggestionActions } from './SuggestionActions';
import { Users, Search, MapPin, Clock } from "lucide-react";

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
  const isSkipped = message.isUser && message.content === "Skipped";
  
  // Determine if the content is a research context question and render appropriate icon
  const getResearchQuestionContent = (content: string) => {
    if (content.includes('WHO is involved')) {
      return (
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-full p-2 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">First, WHO is involved in this research area? You can consider</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-gray-700">Who are the practitioners or professionals?</li>
              <li className="text-gray-700">Who are the end users or beneficiaries?</li>
            </ul>
          </div>
        </div>
      );
    } else if (content.includes('WHAT specific aspects')) {
      return (
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-full p-2 text-white">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Go it! WHAT specific aspects of this field are you interested in? You can consider</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-gray-700">What particular approach, technique, or application?</li>
              <li className="text-gray-700">What is the purpose or objective?</li>
            </ul>
          </div>
        </div>
      );
    } else if (content.includes('WHERE is this research')) {
      return (
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-full p-2 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Now, WHERE is this research typically conducted or applied? You can consider</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-gray-700">In what settings or environments?</li>
              <li className="text-gray-700">Are there specific clinical or research contexts?</li>
              <li className="text-gray-700">Is there a geographical or institutional focus?</li>
            </ul>
          </div>
        </div>
      );
    } else if (content.includes('WHEN is this approach')) {
      return (
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 rounded-full p-2 text-white">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Thank you! Finally, WHEN is this approach most relevant or applicable? You can consider</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-gray-700">Under what conditions or circumstances?</li>
              <li className="text-gray-700">Is there a specific time frame or stage?</li>
              <li className="text-gray-700">Are there temporal factors that matter?</li>
            </ul>
          </div>
        </div>
      );
    }
    
    // Default return the content as is
    return <p className="text-base whitespace-pre-line">{content}</p>;
  };
  
  return (
    <div 
      className={`inline-block max-w-[85%] ${
        message.type === 'welcome' 
          ? 'w-full' 
          : ''
      }`}
    >
      {message.isUser ? (
        <div className={`${isSkipped ? 'ml-auto bg-blue-50 px-4 py-2 rounded-lg' : 'bg-white border border-gray-200 px-4 py-3 rounded-lg'}`}>
          {isSkipped ? (
            <span className="text-blue-700 font-medium">Skipped</span>
          ) : (
            <p className="text-base">{message.content}</p>
          )}
        </div>
      ) : (
        <div className={`${
          message.type === 'welcome'
            ? 'bg-blue-50 p-4 rounded-xl w-full'
            : 'bg-blue-50 text-blue-900 p-4 rounded-xl'
        }`}>
          {message.content.includes('WHO is involved') || 
           message.content.includes('WHAT specific aspects') || 
           message.content.includes('WHERE is this research') || 
           message.content.includes('WHEN is this approach') 
            ? getResearchQuestionContent(message.content)
            : <p className={`${message.type === 'welcome' ? 'text-lg text-blue-800 mb-4' : 'text-base'} whitespace-pre-line`}>
                {message.content}
              </p>
          }
          
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
      )}
    </div>
  );
};
