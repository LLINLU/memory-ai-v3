
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SidebarContent } from "@/components/technology-tree/SidebarContent";
import { MainContent } from "@/components/technology-tree/MainContent";
import { SidebarControls } from "@/components/technology-tree/SidebarControls";
import { CollapsedSidebar } from "@/components/technology-tree/CollapsedSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { level1Items, level2Items, level3Items } from "@/data/technologyTreeData";

const getLevelNames = (selectedPath: { level1: string }) => {
  if (selectedPath.level1.includes('optics')) {
    return {
      level1: "Optical Technologies",
      level2: "Applications",
      level3: "Implementation Methods"
    };
  } else if (selectedPath.level1.includes('medical')) {
    return {
      level1: "Medical Fields",
      level2: "Specializations",
      level3: "Procedures"
    };
  }
  return {
    level1: "Technology Areas",
    level2: "Focus Areas",
    level3: "Specific Methods"
  };
};

const TechnologyTree = () => {
  const {
    selectedPath,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    inputValue,
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    handleInputChange,
    chatMessages,
    hasUserMadeSelection
  } = useTechnologyTree();

  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    updateTabsHorizontalState(sidebarTab);
  }, [sidebarTab]);

  const levelNames = getLevelNames(selectedPath);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel 
            defaultSize={60} 
            minSize={30}
            className={isExpanded ? 'hidden' : undefined}
          >
            <MainContent
              selectedPath={selectedPath}
              level1Items={level1Items}
              level2Items={level2Items}
              level3Items={level3Items}
              onNodeClick={handleNodeClick}
              levelNames={levelNames}
              hasUserMadeSelection={hasUserMadeSelection}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {showSidebar && !collapsedSidebar && (
            <ResizablePanel 
              defaultSize={isExpanded ? 100 : 40} 
              minSize={20}
              maxSize={isExpanded ? 100 : 50}
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
                    onInputChange={handleInputChange}
                  />
                </div>
              </div>
            </ResizablePanel>
          )}
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

export default TechnologyTree;
