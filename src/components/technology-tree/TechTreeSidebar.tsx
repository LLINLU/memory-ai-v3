
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
}) => {
  // Handle wheel events to prevent bubbling to main page level
  // but allow scrolling within scrollable containers
  const handleSidebarWheel = (event: React.WheelEvent) => {
    const target = event.target as HTMLElement;
    
    // Find if the target or any parent has overflow-auto or scroll capability
    let current = target;
    while (current && current !== event.currentTarget) {
      const computedStyle = window.getComputedStyle(current);
      if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
        // Allow natural scrolling within scrollable containers
        return;
      }
      current = current.parentElement as HTMLElement;
    }
    
    // Only stop propagation if not within a scrollable container
    event.stopPropagation();
  };

  return (
    <ResizablePanel
      defaultSize={20}
      minSize={20}
      maxSize={isExpanded ? 80 : 50}
      onResize={onResize}
    >
      <div className="h-full bg-white border-l border-gray-200 shadow-lg flex flex-col" onWheel={handleSidebarWheel}>
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
          />
        </div>
      </div>
    </ResizablePanel>
  );
};
