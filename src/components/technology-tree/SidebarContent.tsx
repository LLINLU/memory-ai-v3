import React from "react";
import { SearchResults } from "./SearchResults";
import { ChatConversation } from "./ChatConversation";
import { ChatInput } from "./ChatInput";
import { EnrichedDataDisplay } from "./EnrichedDataDisplay";
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
  selectedNodeId?: string;
  selectedPath?: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
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
  selectedNodeId,
  selectedPath,
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
  } // Always show SearchResults, but pass real data when a node is selected
  return (
    <div className="h-full flex flex-col">
      <SearchResults
        selectedNodeTitle={selectedNodeTitle}
        selectedNodeDescription={selectedNodeDescription}
        selectedNodeId={selectedNodeId}
      />
    </div>
  );
};
