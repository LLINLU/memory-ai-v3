
import React, { ReactNode } from 'react';

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
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${
        showSidebar ? (collapsedSidebar ? 'w-[calc(100%-60px)]' : 'w-[calc(100%-400px)]') : 'w-full'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>Technology Tree</div>
          {headerActions}
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {showSidebar && (
        <ResizablePanel 
          defaultSize={isExpanded ? 100 : 40} 
          minSize={20}
          maxSize={isExpanded ? 100 : 50}
          onResize={handlePanelResize}
        >
          {sidebarContent}
        </ResizablePanel>
      )}
    </div>
  );
};
