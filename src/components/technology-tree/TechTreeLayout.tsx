
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
      {showSidebar ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className={`flex-1 flex flex-col relative transition-all duration-300`}>
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div>Technology Tree</div>
                {headerActions}
              </div>
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </div>
          </ResizablePanel>

          <ResizablePanel 
            defaultSize={40} 
            minSize={20}
            maxSize={isExpanded ? 60 : 50}
            onResize={handlePanelResize}
          >
            {sidebarContent}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 flex flex-col relative w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div>Technology Tree</div>
            {headerActions}
          </div>
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
