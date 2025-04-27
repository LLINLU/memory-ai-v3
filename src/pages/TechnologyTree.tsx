
import { useEffect, useState } from "react";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { MainContent } from "@/components/technology-tree/MainContent";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { NodeSuggestion } from '@/types/chat';
import { Undo2, Redo2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    setSidebarTab,
    setShowSidebar,
    handleNodeClick,
    toggleSidebar,
    hasUserMadeSelection,
    addCustomNode,
    level1Items,
    level2Items,
    level3Items,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo
  } = useTechnologyTree();

  const {
    inputValue,
    chatMessages,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    setChatMessages
  } = useTechTreeChat();

  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    updateTabsHorizontalState(sidebarTab);
  }, [sidebarTab]);

  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab]);

  useEffect(() => {
    const handleSwitchToChatEvent = (event: CustomEvent) => {
      setSidebarTab("chat");
      setShowSidebar(true);
      handleSwitchToChat(event.detail.message);
    };

    document.addEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    
    return () => {
      document.removeEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    };
  }, [setSidebarTab, setShowSidebar]);

  const levelNames = getLevelNames(selectedPath);

  const handlePanelResize = () => {
    const event = new CustomEvent('panel-resize');
    document.dispatchEvent(event);
  };

  const handleUseNode = (suggestion: NodeSuggestion) => {
    if (chatMessages.length > 0) {
      // Try to find a message that mentions a level
      for (const message of chatMessages) {
        const levelMatch = message.content?.match(/Level (\d+)/i);
        if (levelMatch) {
          const levelNum = levelMatch[1];
          const level = `level${levelNum}`;
          console.log(`Adding custom node to ${level}:`, suggestion);
          addCustomNode(level, suggestion);
          return;
        }
      }
      
      // Default to level2 if no specific level found
      addCustomNode('level2', suggestion);
    }
  };

  const mainContent = (
    <MainContent
      selectedPath={selectedPath}
      level1Items={level1Items}
      level2Items={level2Items}
      level3Items={level3Items}
      onNodeClick={handleNodeClick}
      levelNames={levelNames}
      hasUserMadeSelection={hasUserMadeSelection}
    />
  );

  const sidebarContent = (
    <TechTreeSidebar
      sidebarTab={sidebarTab}
      setSidebarTab={setSidebarTab}
      toggleSidebar={toggleSidebar}
      isExpanded={isExpanded}
      toggleExpand={toggleExpand}
      chatMessages={chatMessages}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSendMessage={handleSendMessage}
      onUseNode={handleUseNode}
      onResize={handlePanelResize}
    />
  );

  return (
    <TechTreeLayout
      showSidebar={showSidebar}
      collapsedSidebar={collapsedSidebar}
      isExpanded={isExpanded}
      toggleSidebar={toggleSidebar}
      setShowSidebar={setShowSidebar}
      handlePanelResize={handlePanelResize}
      sidebarContent={sidebarContent}
      headerActions={
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUndo}
            disabled={!canUndo}
            className="text-gray-500 hover:text-gray-700"
          >
            <Undo2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRedo}
            disabled={!canRedo}
            className="text-gray-500 hover:text-gray-700"
          >
            <Redo2 className="h-5 w-5" />
          </Button>
        </div>
      }
    >
      {mainContent}
    </TechTreeLayout>
  );
};

export default TechnologyTree;
