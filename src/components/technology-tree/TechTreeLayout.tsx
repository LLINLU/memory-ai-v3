import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CollapsedSidebar } from "@/components/technology-tree/CollapsedSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  // Add debug logging for layout-level wheel events
  useEffect(() => {
    const handleLayoutWheel = (e: WheelEvent) => {
      console.log('🟠 TechTreeLayout wheel event detected');
      console.log('Target:', e.target);
      console.log('Target className:', (e.target as HTMLElement)?.className);
      console.log('Should be isolated by mindmap handlers');
    };
    const layoutElement = document.querySelector('.tech-tree-layout');
    if (layoutElement) {
      layoutElement.addEventListener('wheel', handleLayoutWheel);
      return () => layoutElement.removeEventListener('wheel', handleLayoutWheel);
    }
  }, []);

  // If sidebar is hidden or collapsed, use the original flex layout
  if (!showSidebar || collapsedSidebar) {
    return <div className="h-screen bg-gray-50 flex overflow-hidden tech-tree-layout">
        {/* Left side - Mindmap/Treemap area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Collapsed sidebar */}
        {collapsedSidebar && <CollapsedSidebar toggleSidebar={toggleSidebar} />}

        {/* Floating search button when sidebar is hidden */}
        {!showSidebar && !collapsedSidebar && <Button className="fixed right-4 bottom-4 rounded-full bg-blue-500 p-3" onClick={() => setShowSidebar(true)} size="icon">
            <Search className="h-5 w-5" />
          </Button>}
      </div>;
  }

  // Use resizable layout when sidebar is shown
  return <div className="h-screen bg-gray-50 overflow-hidden tech-tree-layout">
      <ResizablePanelGroup direction="horizontal" onLayout={() => handlePanelResize()} className="h-full">
        {/* Main content panel */}
        <ResizablePanel defaultSize={75} minSize={40} className="overflow-hidden">
          {children}
        </ResizablePanel>

        {/* Resizable handle */}
        <ResizableHandle withHandle className="w-px transition-colors bg-slate-200" />

        {/* Sidebar panel */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="bg-white border-l border-gray-200">
          {sidebarContent}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>;
};
