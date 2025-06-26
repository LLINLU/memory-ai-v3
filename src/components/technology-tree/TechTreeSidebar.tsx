import React from "react";
import { SidebarControls } from "@/components/technology-tree/SidebarControls";
import { SidebarContent } from "@/components/technology-tree/SidebarContent";
import { NodeSuggestion } from "@/types/chat";
import { NodeInfo } from "@/services/nodeEnrichmentService.ts";

interface TechTreeSidebarProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  toggleSidebar: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  chatMessages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onUseNode: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  onResize: () => void;
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
  parentNodes?: NodeInfo[];
}

export const TechTreeSidebar: React.FC<TechTreeSidebarProps> = ({
  sidebarTab,
  setSidebarTab,
  toggleSidebar,
  isExpanded,
  toggleExpand,
  chatMessages,
  inputValue,
  onInputChange,
  onSendMessage,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults,
  onResize,
  selectedNodeTitle,
  selectedNodeDescription,
  selectedNodeId,
  selectedPath,
  parentNodes,
}) => {
  return (
    <div className="h-full flex flex-col">
      <SidebarControls
        sidebarTab={sidebarTab}
        setSidebarTab={setSidebarTab}
        toggleSidebar={toggleSidebar}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
      />

      <div className="flex-1 overflow-hidden">
        <SidebarContent
          sidebarTab={sidebarTab}
          chatMessages={chatMessages}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          onUseNode={onUseNode}
          onEditNode={onEditNode}
          onRefine={onRefine}
          onCheckResults={onCheckResults}
          selectedNodeTitle={selectedNodeTitle}
          selectedNodeDescription={selectedNodeDescription}
          selectedNodeId={selectedNodeId}
          selectedPath={selectedPath}
          parentNodes={parentNodes}
        />
      </div>
    </div>
  );
};
