
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

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
  handlePanelResize
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - identical to homepage */}
        <AppSidebar />
        
        {/* Main content */}
        <ResizablePanelGroup direction="horizontal" onLayout={handlePanelResize}>
          <ResizablePanel 
            defaultSize={60} 
            minSize={30}
            className={isExpanded ? 'hidden' : undefined}
            onResize={handlePanelResize}
          >
            {children}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {showSidebar && !collapsedSidebar && sidebarContent}
        </ResizablePanelGroup>

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
