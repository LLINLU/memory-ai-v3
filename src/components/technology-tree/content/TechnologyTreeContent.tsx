
import React from "react";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { TechTreeMainContent } from "@/components/technology-tree/TechTreeMainContent";
import { FallbackAlert } from "@/components/technology-tree/FallbackAlert";
import { useTechnologyTreeContext } from "../providers/TechnologyTreeProvider";

interface TechnologyTreeContentProps {
  savedConversationHistory: any[];
  showFallbackAlert: boolean;
  setShowFallbackAlert: (show: boolean) => void;
}

export const TechnologyTreeContent: React.FC<TechnologyTreeContentProps> = ({
  savedConversationHistory,
  showFallbackAlert,
  setShowFallbackAlert
}) => {
  const {
    selectedPath,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    isExpanded,
    toggleSidebar,
    setShowSidebar,
    handlePanelResize,
    chatMessages,
    inputValue,
    handleInputChange,
    handleSendMessage,
    handleUseNode,
    handleEditNodeFromChat,
    handleRefineNode,
    handleCheckResults,
    selectedNodeInfo,
    setSidebarTab,
    toggleExpand,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    handleNodeClick,
    editNode,
    deleteNode,
    levelNames,
    hasUserMadeSelection,
    scenario,
    handleEditScenario,
    handleAddLevel4,
    showLevel4,
    searchMode
  } = useTechnologyTreeContext();

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
    <TechTreeLayout
      showSidebar={showSidebar}
      collapsedSidebar={collapsedSidebar}
      isExpanded={isExpanded}
      toggleSidebar={toggleSidebar}
      setShowSidebar={setShowSidebar}
      handlePanelResize={handlePanelResize}
      sidebarContent={sidebarContent}
    >
      <div className="p-4">
        <FallbackAlert 
          isVisible={showFallbackAlert}
          onDismiss={() => setShowFallbackAlert(false)}
        />
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
          showLevel4={showLevel4}
          searchMode={searchMode}
        />
      </div>
    </TechTreeLayout>
  );
};
