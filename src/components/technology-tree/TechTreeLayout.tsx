import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CollapsedSidebar } from "@/components/technology-tree/CollapsedSidebar";

interface TechTreeLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
  setShowSidebar: (show: boolean) => void;
  handlePanelResize: () => void;
}

export const TechTreeLayout: React.FC<TechTreeLayoutProps> = ({
  children,
  sidebarContent,
  showSidebar,
  collapsedSidebar,
  isExpanded,
  toggleSidebar,
  setShowSidebar,
  handlePanelResize,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {" "}
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={handlePanelResize}
        >
          <ResizablePanel
            defaultSize={isExpanded ? 20 : 60}
            minSize={isExpanded ? 15 : 30}
            maxSize={isExpanded ? 30 : 70}
            className="overflow-hidden"
            onResize={handlePanelResize}
          >
            {children}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {showSidebar && !collapsedSidebar && sidebarContent}
        </ResizablePanelGroup>
        {collapsedSidebar && <CollapsedSidebar toggleSidebar={toggleSidebar} />}
        {!showSidebar && !collapsedSidebar && (
          <Button
            className="fixed right-4 bottom-4 rounded-full bg-blue-500 p-3"
            onClick={() => setShowSidebar(true)}
            size="icon"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
