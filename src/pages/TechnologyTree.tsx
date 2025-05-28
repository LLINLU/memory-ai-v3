
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";
import { useNodeInfo } from "@/hooks/tree/useNodeInfo";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatBox } from "@/components/technology-tree/ChatBox";
import { TechTreeMainContent } from "@/components/technology-tree/TechTreeMainContent";
import { useScenarioState } from "@/hooks/tree/useScenarioState";
import { useChatInitialization } from "@/hooks/tree/useChatInitialization";
import { useNodeSelectionEffect } from "@/hooks/tree/useNodeSelectionEffect";
import { toast } from "@/components/ui/use-toast";

const TechnologyTree = () => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string; 
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    tedResults?: any;
    treeData?: any;
  } | null;
  
  // Store the conversation history from the research context
  const [savedConversationHistory, setSavedConversationHistory] = useState<any[]>([]);
  
  // Extract conversation history from location state if available
  useEffect(() => {
    if (locationState?.conversationHistory) {
      setSavedConversationHistory(locationState.conversationHistory);
    }
  }, [locationState]);
  
  const { scenario, handleEditScenario, searchMode } = useScenarioState({ 
    initialScenario: locationState?.scenario,
    initialSearchMode: locationState?.searchMode
  });

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
    level3Items,
    level4Items,
    showLevel4,
    handleAddLevel4
  } = useTechnologyTree();

  // Initialize tree data with TED results if available
  useEffect(() => {
    if (locationState?.treeData && locationState?.tedResults) {
      console.log('Initializing with TED-generated tree data:', locationState.treeData);
      
      // Show success message with TED evaluation scores
      const tedResults = locationState.tedResults;
      const scores = [];
      if (tedResults.purpose?.evaluation?.total_score) {
        scores.push(`Purpose: ${Math.round(tedResults.purpose.evaluation.total_score / 4)}%`);
      }
      if (tedResults.function?.evaluation?.total_score) {
        scores.push(`Function: ${Math.round(tedResults.function.evaluation.total_score / 4)}%`);
      }
      if (tedResults.measure?.evaluation?.total_score) {
        scores.push(`Measure: ${Math.round(tedResults.measure.evaluation.total_score / 4)}%`);
      }
      
      toast({
        title: "TED Tree Generated Successfully",
        description: `Quality scores: ${scores.join(', ')}`,
      });
    }
  }, [locationState?.treeData, locationState?.tedResults]);

  const {
    inputValue,
    chatMessages,
    isLoading,
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
    handleEditNodeFromChat, 
    handleRefineNode 
  } = useTechTreeSidebarActions(setChatMessages, addCustomNode, setSidebarTab);

  const selectedNodeInfo = useNodeInfo(selectedPath, level1Items, level2Items, level3Items);
  const levelNames = {
    level1: "目的",
    level2: "機能",
    level3: "手段／技術",
    level4: "実装"
  };

  const handlePanelResize = () => {
    const event = new CustomEvent('panel-resize');
    document.dispatchEvent(event);
  };

  // Initialize chat with context data
  useChatInitialization({
    locationState,
    chatMessages,
    setChatMessages,
    handleSwitchToChat
  });

  // Handle node selection effects
  useNodeSelectionEffect({
    selectedPath,
    setShowSidebar,
    setSidebarTab
  });

  // Set default tabs
  useEffect(() => {
    updateTabsHorizontalState("result");
    setSidebarTab("result");
  }, [setSidebarTab]);

  // Initialize chat when sidebar tab changes
  useEffect(() => {
    initializeChat(sidebarTab);
  }, [sidebarTab, initializeChat]);

  // Update page title to reflect the new text if needed
  useEffect(() => {
    document.title = "研究背景を整理します | Technology Tree";
  }, []);

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
            <TechTreeMainContent
              selectedPath={selectedPath}
              level1Items={level1Items}
              level2Items={level2Items}
              level3Items={level3Items}
              level4Items={level4Items}
              handleNodeClick={handleNodeClick}
              editNode={editNode}
              deleteNode={deleteNode}
              levelNames={levelNames}
              hasUserMadeSelection={hasUserMadeSelection}
              scenario={scenario}
              onEditScenario={handleEditScenario}
              conversationHistory={savedConversationHistory}
              handleAddLevel4={handleAddLevel4}
              searchMode={searchMode}
            />
          </TechTreeLayout>
          
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
