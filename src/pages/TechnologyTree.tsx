
import { useLocation } from "react-router-dom";
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
import { useTreemapEffects } from "@/hooks/tree/useTreemapEffects";
import { TechnologyTreeProvider } from "@/components/technology-tree/TechnologyTreeProvider";

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
  
  const { scenario, handleEditScenario, searchMode } = useScenarioState({ 
    initialScenario: locationState?.scenario,
    initialSearchMode: locationState?.searchMode
  });

  // Add treemap generation effects
  const { treemapData, isGenerating, error } = useTreemapEffects({
    query: locationState?.query,
    scenario,
    searchMode: locationState?.searchMode
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
    <TechnologyTreeProvider
      setSidebarTab={setSidebarTab}
      sidebarTab={sidebarTab}
      initializeChat={initializeChat}
    >
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
                conversationHistory={locationState?.conversationHistory || []}
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
    </TechnologyTreeProvider>
  );
};

export default TechnologyTree;
