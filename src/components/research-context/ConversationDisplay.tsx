
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

interface ConversationDisplayProps {
  conversationHistory: Message[];
  onEditReply?: (content: string, index: number) => void;
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  conversationHistory,
  onEditReply
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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

  // Filter out duplicate consecutive messages with the same questionType
  const filteredHistory = conversationHistory.filter((message, index, array) => {
    if (index === 0) return true;
    
    const prevMessage = array[index - 1];
    
    // If this is a system message with a questionType that matches the previous message's questionType
    // and they're not separated by a user message, filter it out
    if (
      message.type === "system" && 
      prevMessage.type === "system" && 
      message.questionType && 
      prevMessage.questionType && 
      message.questionType === prevMessage.questionType
    ) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {filteredHistory.map((message, index) => (
        <div key={index} className={`mb-6 ${message.type === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
          {message.type === "system" ? (
            <div className="max-w-[80%]">{message.content}</div>
          ) : editingIndex === index ? (
            <div className="w-full max-w-3xl">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <Textarea 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full resize-none border-0 p-0 focus-visible:ring-0"
                  rows={4}
                />
                <div className="text-xs text-gray-500 mt-2">
                  <span>Editing this message will update the scenario</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateEdit}
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[80%]">
                <p>{message.content}</p>
              </div>
              {typeof message.content === 'string' && (
                <div className="flex gap-1 mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0.5 hover:bg-blue-200"
                    onClick={() => handleCopy(message.content as string)}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0.5 hover:bg-blue-200"
                    onClick={() => handleEdit(message.content as string, index)}
                  >
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
