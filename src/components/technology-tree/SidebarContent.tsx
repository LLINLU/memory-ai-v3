
import React from "react";
import { SearchResults } from "./SearchResults";
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
  selectedNodeTitle,
  selectedNodeDescription
}: SidebarContentProps) => {
  return (
    <div className="h-full flex flex-col">
      <SearchResults 
        selectedNodeTitle={selectedNodeTitle} 
        selectedNodeDescription={selectedNodeDescription}
      />
    </div>
  );
};
