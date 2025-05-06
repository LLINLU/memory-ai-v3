
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Edit } from "lucide-react";
import { toast } from "sonner";

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
  const handleCopy = (content: string) => {
    if (typeof content === "string") {
      navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    }
  };

  const handleEdit = (content: string, index: number) => {
    if (typeof content === "string" && onEditReply) {
      onEditReply(content, index);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {conversationHistory.map((message, index) => (
        <div key={index} className={`mb-6 ${message.type === "user" ? "flex flex-col items-end" : ""}`}>
          {message.type === "system" ? (
            <div>{message.content}</div>
          ) : (
            <div className="flex flex-col">
              <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[60%]">
                <p>{message.content}</p>
              </div>
              {typeof message.content === 'string' && (
                <div className="flex gap-1 mt-1 justify-end">
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
