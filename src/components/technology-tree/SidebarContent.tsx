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
  }
  // For result tab, show enriched data if a node is selected, otherwise show SearchResults
  if (selectedNodeId && selectedNodeId.trim() && selectedPath) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium text-sm text-gray-900">
            {selectedNodeTitle}
          </h3>
          {selectedNodeDescription && (
            <p className="text-xs text-gray-600 mt-1">
              {selectedNodeDescription}
            </p>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          <EnrichedDataDisplay nodeId={selectedNodeId} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SearchResults
        selectedNodeTitle={selectedNodeTitle}
        selectedNodeDescription={selectedNodeDescription}
      />
    </div>
  );
};
