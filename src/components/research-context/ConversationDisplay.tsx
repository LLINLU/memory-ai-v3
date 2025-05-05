
import React from "react";

interface Message {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

interface ConversationDisplayProps {
  conversationHistory: Message[];
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  conversationHistory 
}) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {conversationHistory.map((message, index) => (
        <div key={index} className={`mb-6 ${message.type === "user" ? "flex justify-end" : ""}`}>
          {message.type === "system" ? (
            <div>{message.content}</div>
          ) : (
            <div className="bg-blue-100 text-blue-900 p-3 rounded-lg max-w-[60%]">
              <p>{message.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
