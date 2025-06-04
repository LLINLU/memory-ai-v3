import React from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { SidebarControls } from "@/components/technology-tree/SidebarControls";
import { SidebarContent } from "@/components/technology-tree/SidebarContent";
import { NodeSuggestion } from "@/types/chat";

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
}) => {
  return (
    <ResizablePanel
      defaultSize={isExpanded ? 70 : 40}
      minSize={20}
      maxSize={isExpanded ? 80 : 50}
      onResize={onResize}
    >
      <div className="h-full bg-white border-l border-gray-200 shadow-lg flex flex-col">
        <SidebarControls
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          toggleSidebar={toggleSidebar}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          selectedNodeTitle={selectedNodeTitle}
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
          />
        </div>
      </div>
    </ResizablePanel>
  );
};
