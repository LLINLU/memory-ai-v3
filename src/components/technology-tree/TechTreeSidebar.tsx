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
  onResize: () => void;
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
  onResize
}) => {
  const handleCheckResults = () => {
    setSidebarTab("result");
  };

  return (
    <ResizablePanel 
      defaultSize={isExpanded ? 100 : 40} 
      minSize={20}
      maxSize={isExpanded ? 100 : 50}
      onResize={onResize}
    >
      <div className="h-full bg-white border-l border-gray-200 shadow-lg flex flex-col">
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
            onEditNode={(suggestion) => console.log('Edit node:', suggestion)}
            onRefine={(suggestion) => console.log('Refine node:', suggestion)}
            onCheckResults={handleCheckResults}
          />
        </div>
      </div>
    </ResizablePanel>
  );
};
