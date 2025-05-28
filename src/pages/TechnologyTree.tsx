
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";
import { useNodeInfo } from "@/hooks/tree/useNodeInfo";
import { useScenarioState } from "@/hooks/tree/useScenarioState";
import { useChatInitialization } from "@/hooks/tree/useChatInitialization";
import { useLocationState } from "@/hooks/tree/useLocationState";
import { useTechTreeEffects } from "@/hooks/tree/useTechTreeEffects";
import { TechTreePage } from "@/components/technology-tree/TechTreePage";

const TechnologyTree = () => {
  const { locationState, savedConversationHistory } = useLocationState();
  
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

  // Handle all effects
  useTechTreeEffects({
    sidebarTab,
    setSidebarTab,
    initializeChat,
    selectedPath,
    setShowSidebar,
    chatMessages,
    setChatMessages,
    handleSwitchToChat,
    locationState
  });

  return (
    <TechTreePage
      sidebarTab={sidebarTab}
      setSidebarTab={setSidebarTab}
      showSidebar={showSidebar}
      collapsedSidebar={collapsedSidebar}
      isExpanded={isExpanded}
      toggleSidebar={toggleSidebar}
      setShowSidebar={setShowSidebar}
      toggleExpand={toggleExpand}
      chatMessages={chatMessages}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSendMessage={handleSendMessage}
      onUseNode={handleUseNode}
      onEditNodeFromChat={handleEditNodeFromChat}
      onRefineNode={handleRefineNode}
      onCheckResults={handleCheckResults}
      onButtonClick={handleButtonClick}
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
      selectedNodeTitle={selectedNodeInfo.title}
      selectedNodeDescription={selectedNodeInfo.description}
      handlePanelResize={handlePanelResize}
    />
  );
};

export default TechnologyTree;
