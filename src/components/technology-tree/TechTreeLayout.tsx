
import React, { useEffect } from "react";
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden tech-tree-layout">
      {/* Left side - Mindmap/Treemap area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Right side - Papers panel */}
      {showSidebar && !collapsedSidebar && (
        <div className="w-96 h-full bg-white border-l border-gray-200 shadow-lg">
          {sidebarContent}
        </div>
      )}

      {/* Collapsed sidebar */}
      {collapsedSidebar && <CollapsedSidebar toggleSidebar={toggleSidebar} />}

      {/* Floating search button when sidebar is hidden */}
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
  );
};
