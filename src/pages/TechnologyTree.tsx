import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { MainContent } from "@/components/technology-tree/MainContent";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";
import { useNodeInfo } from "@/hooks/tree/useNodeInfo";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatBox } from "@/components/technology-tree/ChatBox";

const TechnologyTree = () => {
  const location = useLocation();
  const locationState = location.state as { query?: string; scenario?: string } | null;
  
  const [scenario, setScenario] = useState(
    locationState?.scenario || 
    "Advancing adaptive optics technology to address challenges in astronomy, biomedicine, and defense applications"
  );

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
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items
  } = useTechnologyTree();

  const {
    inputValue,
    chatMessages,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages
  } = useTechTreeChat();

  const { 
    isExpanded, 
    toggleExpand, 
    handleCheckResults, 
    handleUseNode, 
    handleEditNodeFromChat 
  } = useTechTreeSidebarActions(setChatMessages, addCustomNode, setSidebarTab);

  const handleRefineNode = (suggestion: any) => {
    setChatMessages(prev => [
      ...prev,
      {
        isUser: true,
        content: `Please refine "${suggestion.title}" to be more specific.`
      }
    ]);
    
    // Simulate AI response with a refined suggestion
    setTimeout(() => {
      const refinedTitle = `Refined: ${suggestion.title}`;
      const refinedDescription = `${suggestion.description} Focused on early-stage detection with improved accuracy.`;
      
      setChatMessages(prev => [
        ...prev,
        {
          content: `I've refined your node to be more specific:\n\n🔹Title: ${refinedTitle}\n🔹Description: ${refinedDescription}\n\nWould you like to:`,
          isUser: false,
          suggestion: {
            title: refinedTitle,
            description: refinedDescription
          }
        }
      ]);
    }, 500);
  };

  const selectedNodeInfo = useNodeInfo(selectedPath, level1Items, level2Items, level3Items);
  const levelNames = {
    level1: "Purpose",
    level2: "Function",
    level3: "Technology"
  };

  const handlePanelResize = () => {
    const event = new CustomEvent('panel-resize');
    document.dispatchEvent(event);
  };

  const handleEditScenario = () => {
    const newScenario = prompt("Edit scenario:", scenario);
    if (newScenario) {
      setScenario(newScenario);
    }
  };

  useEffect(() => {
    updateTabsHorizontalState("result"); // Default to result tab
    setSidebarTab("result"); // Set default tab to result
  }, [setSidebarTab]);

  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab]);

  useEffect(() => {
    const handleSwitchToChatEvent = (event: CustomEvent) => {
      handleSwitchToChat(event.detail.message);
    };

    document.addEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    
    return () => {
      document.removeEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    };
  }, [handleSwitchToChat]);

  useEffect(() => {
    if (locationState?.scenario && chatMessages.length === 0) {
      // Initialize chat with context data from ResearchContext
      const contextData = `Based on your research interests in ${locationState.scenario}, I've created this technology tree. You can explore different branches or ask me for more specific information.`;
      
      setChatMessages([{
        type: "text",
        content: contextData,
        isUser: false
      }]);
    }
  }, [locationState, chatMessages.length, setChatMessages]);

  // Add this useEffect to make sure sidebar opens when a node is clicked
  useEffect(() => {
    if (selectedPath.level3) {
      setShowSidebar(true);
      setSidebarTab("result");
      
      // Dispatch an event to refresh paper list with the selected node
      const event = new CustomEvent('refresh-papers', {
        detail: { nodeId: selectedPath.level3 }
      });
      document.dispatchEvent(event);
    }
  }, [selectedPath.level3, setShowSidebar, setSidebarTab]);

  const mainContent = (
    <MainContent
      selectedPath={selectedPath}
      level1Items={level1Items}
      level2Items={level2Items}
      level3Items={level3Items}
      onNodeClick={handleNodeClick}
      onEditNode={editNode}
      onDeleteNode={deleteNode}
      levelNames={levelNames}
      hasUserMadeSelection={hasUserMadeSelection}
      scenario={scenario}
      onEditScenario={handleEditScenario}
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
      onEditNode={handleEditNodeFromChat}
      onRefine={handleRefineNode}
      onCheckResults={handleCheckResults}
      onResize={handlePanelResize}
      selectedNodeTitle={selectedNodeInfo.title}
      selectedNodeDescription={selectedNodeInfo.description}
    />
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <TechTreeLayout
            showSidebar={showSidebar}
            collapsedSidebar={collapsedSidebar}
            isExpanded={isExpanded}
            toggleSidebar={toggleSidebar}
            setShowSidebar={setShowSidebar}
            handlePanelResize={handlePanelResize}
            sidebarContent={sidebarContent}
          >
            {mainContent}
          </TechTreeLayout>
          
          {/* ChatBox with node actions */}
          <ChatBox
            messages={chatMessages}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onButtonClick={handleButtonClick}
            onUseNode={handleUseNode}
            onEditNode={handleEditNodeFromChat}
            onRefine={handleRefineNode}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TechnologyTree;
