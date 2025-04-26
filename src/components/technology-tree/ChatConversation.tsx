
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Edit, MessageSquare } from 'lucide-react';
import { ChatMessage, NodeSuggestion } from '@/types/chat';

interface ChatConversationProps {
  chatMessages: ChatMessage[];
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
}

export const ChatConversation = ({ 
  chatMessages, 
  onUseNode,
  onEditNode,
  onRefine 
}: ChatConversationProps) => {
  const renderSuggestionActions = (suggestion: NodeSuggestion) => (
    <div className="flex gap-2 mt-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onUseNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Check className="h-4 w-4" />
        Use this
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEditNode?.(suggestion)}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onRefine?.(suggestion)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {suggestion.title.includes('Refined') ? 'Narrow further' : 'Refine further'}
      </Button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div 
            className={`inline-block max-w-[85%] p-4 rounded-2xl ${
              message.isUser 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-white text-gray-800'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
            {message.suggestion && renderSuggestionActions(message.suggestion)}
          </div>
        </div>
      ))}
    </div>
  );
};
