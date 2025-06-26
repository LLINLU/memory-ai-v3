
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeMainContent } from "@/components/technology-tree/TechTreeMainContent";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { QueueStatusDisplay } from "@/components/technology-tree/QueueStatusDisplay";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useMindMapView } from "@/hooks/tree/useMindMapView";
import { useScrollNavigation } from "@/hooks/tree/useScrollNavigation";
import { useTreeDataLoader } from "@/hooks/tree/useTreeDataLoader";
import { useLevel1EnrichmentPolling } from "@/hooks/useLevel1EnrichmentPolling";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";

interface TechnologyTreeProps {
  treeId?: string;
}

const TechnologyTree: React.FC<TechnologyTreeProps> = ({ treeId: propTreeId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const locationState = location.state as {
    treeId?: string;
    query?: string;
    scenario?: string;
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    tedResults?: any;
    treeData?: any;
    treeStructure?: any;
    fromDatabase?: boolean;
    fromPreset?: boolean;
  } | null;

  const finalTreeId = propTreeId || locationState?.treeId;

  const {
    databaseTreeData,
    isLoading: isTreeDataLoading,
    error: treeDataError,
    refetch: refetchTreeData,
  } = useTreeDataLoader(finalTreeId);

  const viewModeHook = useMindMapView();

  const {
    selectedPath,
    sidebarTab,
    showSidebar,
    collapsedSidebar,
    inputValue,
    query,
    chatMessages,
    hasUserMadeSelection,
    showLevel4,
    searchMode,
    scenario,
    justSwitchedView,
    clearViewSwitchFlag,
    handleNodeClick,
    toggleSidebar,
    handleInputChange,
    setQuery,
    setChatMessages,
    setInputValue,
    addCustomNode,
    editNode,
    deleteNode,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    handleAddLevel4,
    userClickedNode,
  } = useTechnologyTree(databaseTreeData, viewModeHook);

  const {
    containerRef: scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    lastVisibleLevel,
    handleScrollToStart,
    handleScrollToEnd,
    triggerScrollUpdate,
  } = useScrollNavigation();

  const { 
    isExpanded,
    toggleExpand,
    handleCheckResults,
    handleUseNode,
    handleEditNodeFromChat,
    handleRefineNode,
  } = useTechTreeSidebarActions(
    setChatMessages,
    addCustomNode,
    () => {} // setSidebarTab placeholder
  );

  useLevel1EnrichmentPolling(finalTreeId);

  const levelNames = {
    level1: "発想・企画",
    level2: "調査・分析",
    level3: "設計・計画",
    level4: "実装・開発",
    level5: "テスト・評価",
    level6: "運用・保守",
    level7: "改善・最適化",
    level8: "展開・拡張",
    level9: "統合・連携",
    level10: "革新・進化",
  };

  if (isTreeDataLoading) {
    return <div>Loading...</div>;
  }

  if (treeDataError) {
    return <div>Error loading tree data: {treeDataError.message}</div>;
  }

  return (
    <TechTreeLayout
      showSidebar={showSidebar}
      collapsedSidebar={collapsedSidebar}
      isExpanded={isExpanded}
      toggleSidebar={toggleSidebar}
      setShowSidebar={() => {}}
      handlePanelResize={() => {}}
      sidebarContent={
        <TechTreeSidebar
          sidebarTab={sidebarTab}
          setSidebarTab={() => {}}
          toggleSidebar={toggleSidebar}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          chatMessages={chatMessages}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSendMessage={() => {}}
          onUseNode={handleUseNode}
          onEditNode={handleEditNodeFromChat}
          onRefine={handleRefineNode}
          onCheckResults={handleCheckResults}
          onResize={() => {}}
          selectedPath={selectedPath}
        />
      }
    >
      <TechTreeMainContent
        selectedPath={selectedPath}
        level1Items={level1Items}
        level2Items={level2Items}
        level3Items={level3Items}
        level4Items={level4Items}
        level5Items={level5Items}
        level6Items={level6Items}
        level7Items={level7Items}
        level8Items={level8Items}
        level9Items={level9Items}
        level10Items={level10Items}
        showLevel4={showLevel4}
        handleNodeClick={handleNodeClick}
        editNode={editNode}
        deleteNode={deleteNode}
        levelNames={levelNames}
        hasUserMadeSelection={hasUserMadeSelection}
        scenario={scenario}
        onEditScenario={() => {}}
        conversationHistory={locationState?.conversationHistory}
        handleAddLevel4={handleAddLevel4}
        searchMode={searchMode}
        onGuidanceClick={() => {}}
        query={query}
        treeMode={databaseTreeData?.mode || "TED"}
        onScrollToStart={handleScrollToStart}
        onScrollToEnd={handleScrollToEnd}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        lastVisibleLevel={lastVisibleLevel}
        containerRef={containerRef}
        triggerScrollUpdate={triggerScrollUpdate}
        viewMode={viewModeHook.viewMode}
        onToggleView={viewModeHook.toggleView}
        justSwitchedView={justSwitchedView}
        onViewSwitchHandled={clearViewSwitchFlag}
      />
      <QueueStatusDisplay 
        userClickedNode={userClickedNode}
      />
    </TechTreeLayout>
  );
};

export default TechnologyTree;
