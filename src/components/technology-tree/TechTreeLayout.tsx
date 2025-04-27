
import React, { ReactNode } from 'react';
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface TechTreeLayoutProps {
  children: ReactNode;
  showSidebar: boolean;
  collapsedSidebar: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
  setShowSidebar: (show: boolean) => void;
  handlePanelResize: () => void;
  sidebarContent: ReactNode;
  headerActions?: ReactNode;
}

export const TechTreeLayout: React.FC<TechTreeLayoutProps> = ({
  children,
  showSidebar,
  collapsedSidebar,
  isExpanded,
  toggleSidebar,
  setShowSidebar,
  handlePanelResize,
  sidebarContent,
  headerActions
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel 
          defaultSize={showSidebar ? (collapsedSidebar ? 80 : 60) : 100} 
          minSize={50}
        >
          <div className="flex-1 flex flex-col relative h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>Technology Tree</div>
              {headerActions}
            </div>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </ResizablePanel>

        {showSidebar && (
          <ResizablePanel 
            defaultSize={isExpanded ? 40 : 20} 
            minSize={20}
            maxSize={isExpanded ? 50 : 30}
            onResize={handlePanelResize}
          >
            {sidebarContent}
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
