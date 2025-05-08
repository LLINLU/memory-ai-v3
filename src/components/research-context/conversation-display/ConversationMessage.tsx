
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

interface ConversationMessageProps {
  message: Message;
  index: number;
  editingIndex: number | null;
  editValue: string;
  onCopy: (content: string) => void;
  onEdit: (content: string, index: number) => void;
  onCancelEdit: () => void;
  onUpdateEdit: () => void;
  setEditValue: (value: string) => void;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({
  message,
  index,
  editingIndex,
  editValue,
  onCopy,
  onEdit,
  onCancelEdit,
  onUpdateEdit,
  setEditValue
}) => {
  const isSystemMessage = message.type === "system";
  const isResearchAreaMessage = isSystemMessage && 
    typeof message.content === 'string' && 
    message.content.includes('潜在的な研究分野');
  
  if (isSystemMessage) {
    return (
      <div 
        className={`w-full max-w-full ${isResearchAreaMessage ? 'conversation-message' : ''}`}
      >
        {message.content}
      </div>
    );
  }
  
  // User message being edited
  if (editingIndex === index) {
    return (
      <div className="w-full max-w-3xl">
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <Textarea 
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full resize-none border-0 p-0 focus-visible:ring-0"
            rows={3}
          />
          <div className="text-xs text-gray-500 mt-1">
            <span>このメッセージを編集するとシナリオが更新されます</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancelEdit}
          >
            キャンセル
          </Button>
          <Button 
            size="sm"
            onClick={onUpdateEdit}
          >
            更新する
          </Button>
        </div>
      </div>
    );
  }
  
  // Regular user message
  return (
    <div className="flex flex-col items-end">
      <div className="bg-blue-100 text-blue-900 p-2 rounded-lg">
        <p>{message.content === "Skipped" ? <span className="whitespace-nowrap">スキップ</span> : message.content}</p>
      </div>
      {typeof message.content === 'string' && (
        <div className="flex gap-1 mt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0.5 hover:bg-blue-200"
            onClick={() => onCopy(message.content as string)}
          >
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0.5 hover:bg-blue-200"
            onClick={() => onEdit(message.content as string, index)}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      )}
    </div>
  );
};
