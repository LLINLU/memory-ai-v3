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
import { useTreemapGeneration } from "@/hooks/research-context/useTreemapGeneration";
import { toast } from "@/components/ui/use-toast";

const TechnologyTree = () => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string; 
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    treemapData?: any[];
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

  // Add treemap generation hook
  const { treemapData, isGenerating, error, generateTreemap } = useTreemapGeneration();

  // Generate treemap based on search mode and available data
  useEffect(() => {
    const query = locationState?.query;
    const currentSearchMode = locationState?.searchMode || "quick";
    
    console.log("TechnologyTree: Checking treemap generation conditions");
    console.log("- Query:", query);
    console.log("- Scenario:", scenario);
    console.log("- Search Mode:", currentSearchMode);
    
    if (query && query.trim() !== '') {
      if (currentSearchMode === "quick") {
        // For quick exploration, generate treemap with just the query
        console.log("TechnologyTree: Quick mode - generating treemap with query only");
        generateTreemap(query);
      } else if (currentSearchMode === "deep" && scenario && scenario.trim() !== '') {
        // For deep exploration, use both scenario and query
        console.log("TechnologyTree: Deep mode - generating treemap with scenario and query");
        generateTreemap(query, scenario);
      } else if (currentSearchMode === "deep") {
        console.log("TechnologyTree: Deep mode but no scenario available yet");
      }
    } else {
      console.log("TechnologyTree: No query available for treemap generation");
    }
  }, [scenario, locationState?.query, locationState?.searchMode, generateTreemap]);

  // Show error toast if treemap generation fails
  useEffect(() => {
    if (error) {
      toast({
        title: "研究エリア生成エラー",
        description: "研究エリアの生成中にエラーが発生しました。デフォルトデータを表示しています。",
        variant: "destructive",
      });
    }
  }, [error]);

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
    updateTabsHorizontalState("result"); // Default to result tab
    setSidebarTab("result"); // Set default tab to result
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
              treemapData={treemapData}
              isGeneratingTreemap={isGenerating}
              treemapError={error}
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
