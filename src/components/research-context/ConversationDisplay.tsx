
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit } from "lucide-react";
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

  // Filter out duplicate messages with the same questionType
  const filteredHistory = conversationHistory.filter((message, index, array) => {
    // Always keep user messages
    if (message.type === "user") return true;
    
    // If it's a system message with a questionType
    if (message.type === "system" && message.questionType) {
      // Check if this is the first occurrence of this questionType
      const firstIndex = array.findIndex(
        m => m.type === "system" && m.questionType === message.questionType
      );
      
      // If this is the first occurrence, keep it
      return firstIndex === index;
    }
    
    // Keep all other messages (system messages without questionType)
    return true;
  });

  return (
    <div>
      {filteredHistory.map((message, index) => (
        <div key={index} className={`mb-4 ${message.type === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
          {message.type === "system" ? (
            <div className="max-w-[80%]">{message.content}</div>
          ) : editingIndex === index ? (
            <div className="w-full max-w-3xl">
              <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <Textarea 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full resize-none border-0 p-0 focus-visible:ring-0"
                  rows={3}
                />
                <div className="text-xs text-gray-500 mt-1">
                  <span>Editing this message will update the scenario</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleUpdateEdit}
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <div className="bg-blue-100 text-blue-900 p-2 rounded-lg max-w-[80%]">
                <p>{message.content === "Skipped" ? "スキップ" : message.content}</p>
              </div>
              {typeof message.content === 'string' && (
                <div className="flex gap-1 mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0.5 hover:bg-blue-200"
                    onClick={() => handleCopy(message.content as string)}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0.5 hover:bg-blue-200"
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
}
