
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { ConversationMessage } from "./conversation-display/ConversationMessage";
import { useConversationScroll } from "./conversation-display/useConversationScroll";
import { useResearchAreaObserver } from "./conversation-display/useResearchAreaObserver";
import { useMessageFilter } from "./conversation-display/useMessageFilter";

interface Message {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

interface ConversationDisplayProps {
  conversationHistory: Message[];
  onEditReply?: (content: string, index: number) => void;
  onResearchAreaVisible?: (isVisible: boolean) => void;
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  conversationHistory,
  onEditReply,
  onResearchAreaVisible
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  // Use the custom hooks
  const { scrollToBottom } = useConversationScroll(conversationEndRef, conversationHistory.length);
  useResearchAreaObserver(conversationHistory, onResearchAreaVisible);
  const filteredHistory = useMessageFilter(conversationHistory);

  const handleCopy = (content: string) => {
    if (typeof content === "string") {
      navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    }
  };

  const handleEdit = (content: string, index: number) => {
    setEditingIndex(index);
    setEditValue(content);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleUpdateEdit = () => {
    if (editingIndex !== null && onEditReply && editValue.trim()) {
      onEditReply(editValue, editingIndex);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  return (
    <div 
      className="w-full space-y-4 pb-8 pt-2" 
      ref={conversationContainerRef}
      style={{ minHeight: "100%" }}
    >
      {filteredHistory.map((message, index) => (
        <div key={index} className={`mb-8 ${message.type === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
          <ConversationMessage
            message={message}
            index={index}
            editingIndex={editingIndex}
            editValue={editValue}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onCancelEdit={handleCancelEdit}
            onUpdateEdit={handleUpdateEdit}
            setEditValue={setEditValue}
          />
        </div>
      ))}
      <div ref={conversationEndRef} />
    </div>
  );
};
