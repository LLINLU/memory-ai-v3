
import React from "react";
import { SearchResults } from "./SearchResults";
import { ChatConversation } from "./ChatConversation";
import { ChatInput } from "./ChatInput";
import { NodeSuggestion } from "@/types/chat";

interface SidebarContentProps {
  sidebarTab: string;
  chatMessages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage?: () => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
}

export const SidebarContent = ({
  sidebarTab,
  chatMessages,
  inputValue,
  onInputChange,
  onSendMessage,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults,
  selectedNodeTitle,
  selectedNodeDescription,
}: SidebarContentProps) => {
  if (sidebarTab === "chat") {
    return (
      <div className="h-full flex flex-col">
        <ChatConversation 
          chatMessages={chatMessages} 
          onUseNode={onUseNode}
          onEditNode={onEditNode}
          onRefine={onRefine}
          onCheckResults={onCheckResults}
        />
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSendMessage}
        />
      </div>
    );
  }

  // Default to showing search results
  return (
    <div className="h-full flex flex-col">
      <SearchResults 
        selectedNodeTitle={selectedNodeTitle} 
        selectedNodeDescription={selectedNodeDescription}
      />
    </div>
  );
};
