
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateTabsHorizontalState } from "@/components/ui/tabs";
import { TechTreeLayout } from "@/components/technology-tree/TechTreeLayout";
import { TechTreeSidebar } from "@/components/technology-tree/TechTreeSidebar";
import { useTechnologyTree } from "@/hooks/useTechnologyTree";
import { useTechTreeChat } from "@/hooks/tree/useTechTreeChat";
import { useTechTreeSidebarActions } from "@/components/technology-tree/hooks/useTechTreeSidebarActions";
import { useNodeInfo } from "@/hooks/tree/useNodeInfo";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useScrollNavigation } from "@/hooks/tree/useScrollNavigation";
import { useMindMapView } from "@/hooks/tree/useMindMapView";

import { ChatBox } from "@/components/technology-tree/ChatBox";
import { TechTreeMainContent } from "@/components/technology-tree/TechTreeMainContent";
import { useScenarioState } from "@/hooks/tree/useScenarioState";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { convertDatabaseTreeToAppFormat } from "@/utils/databaseTreeConverter";
import { toast } from "@/components/ui/use-toast";
import { useChatInitialization } from "@/hooks/tree/useChatInitialization";
import { useNodeSelectionEffect } from "@/hooks/tree/useNodeSelectionEffect";
import { FallbackAlert } from "@/components/technology-tree/FallbackAlert";

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
    treeId?: string;
    treeStructure?: any;
    fromDatabase?: boolean;
    fromPreset?: boolean;
    isDemo?: boolean;
  } | null;

  // Get the current view mode - single source of truth
  const viewModeHook = useMindMapView();
  const { viewMode, toggleView } = viewModeHook;

  // Store the conversation history from the research context
  const [savedConversationHistory, setSavedConversationHistory] = useState<
    any[]
  >([]);
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);
  const [databaseTreeData, setDatabaseTreeData] = useState<any>(null);
  const [hasLoadedDatabase, setHasLoadedDatabase] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const { loadTreeFromDatabase } = useTreeGeneration();

  // Extract conversation history from location state if available
  useEffect(() => {
    if (locationState?.conversationHistory) {
      setSavedConversationHistory(locationState.conversationHistory);
    }
  }, [locationState]);

  // Reset database tree data when tree ID changes
  useEffect(() => {
    setDatabaseTreeData(null);
    setHasLoadedDatabase(false);
  }, [locationState?.treeId]);

  const { scenario, handleEditScenario, searchMode } = useScenarioState({
    initialScenario: locationState?.scenario,
    initialSearchMode: locationState?.searchMode,
  });

  // Initialize scroll navigation hook
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    lastVisibleLevel,
    handleScrollToStart,
    handleScrollToEnd,
    updateLastVisibleLevel,
    triggerScrollUpdate,
  } = useScrollNavigation();
  // Don't render the tree if we're still initializing or no data is available
  if (
    isInitializing ||
    (!databaseTreeData &&
      !locationState?.treeData &&
      !locationState?.fromDatabase &&
      !hasLoadedDatabase)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          {isInitializing ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-4">読み込み中...</h2>
              <p className="text-gray-600">
                技術ツリーデータを初期化しています。
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">
                技術ツリーが見つかりません
              </h2>
              <p className="text-gray-600 mb-4">
                有効な技術ツリーデータがありません。新しい検索を開始してください。
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ホームに戻る
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

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
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    showLevel4,
    handleAddLevel4,
    scenario: databaseScenario, // Get scenario from database tree data
  } = useTechnologyTree(databaseTreeData, viewModeHook); // Pass viewModeHook here

  // Update last visible level when tree data changes and trigger scroll update
  useEffect(() => {
    updateLastVisibleLevel({
      level4Items: Object.values(level4Items).flat(),
      level5Items: Object.values(level5Items).flat(),
      level6Items: Object.values(level6Items).flat(),
      level7Items: Object.values(level7Items).flat(),
      level8Items: Object.values(level8Items).flat(),
      level9Items: Object.values(level9Items).flat(),
      level10Items: Object.values(level10Items).flat(),
    });

    // Trigger scroll update after level data changes
    console.log("Tree data updated, triggering scroll update");
    triggerScrollUpdate();
  }, [
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
    updateLastVisibleLevel,
    triggerScrollUpdate,
  ]);

  // Trigger scroll update when database tree data is loaded
  useEffect(() => {
    if (databaseTreeData) {
      console.log("Database tree data loaded, triggering scroll update");
      triggerScrollUpdate();
    }
  }, [databaseTreeData, triggerScrollUpdate]);

  // Initialize tree data with TED results if available
  useEffect(() => {
    const initializeTreeData = async () => {
      // Helper function to validate UUID format
      const isValidUUID = (str: string) => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      }; // Handle database-generated tree (only if it's a valid UUID and not a demo)
      if (
        locationState?.fromDatabase &&
        locationState?.treeId &&
        !locationState?.isDemo &&
        !hasLoadedDatabase
      ) {
        if (!isValidUUID(locationState.treeId)) {
          console.log(
            "Invalid UUID format, cannot load tree:",
            locationState.treeId
          );
          toast({
            title: "無効なツリーID",
            description:
              "有効なUUID形式のツリーIDが必要です。新しいツリーを生成してください。",
          });
          return;
        }

        console.log("Loading tree from database, ID:", locationState.treeId);
        setHasLoadedDatabase(true); // Prevent re-loading

        try {
          const result = await loadTreeFromDatabase(locationState.treeId);
          if (result?.treeStructure) {
            const convertedData = convertDatabaseTreeToAppFormat(
              result.treeStructure,
              {
                description: result.treeData?.description,
                search_theme: result.treeData?.search_theme,
                name: result.treeData?.name,
                mode: (result.treeData as any)?.mode, // Type assertion for mode field
              }
            );
            if (convertedData) {
              setDatabaseTreeData(convertedData);
              // Set the query from the database tree data
              setCurrentQuery(result.treeData?.search_theme || locationState?.query || "");
              toast({
                title: "データベースツリーを読み込みました",
                description: "保存されたツリー構造を表示しています。",
              });
            }
          }
        } catch (error) {
          console.error("Error loading database tree:", error);
          setHasLoadedDatabase(false); // Allow retry on error
        }
        return;
      } // Handle preset technology trees from sidebar - REMOVED
      // Preset functionality has been removed to clean up demo data      // Handle demo trees or trees with demo IDs - show error instead of demo mode
      if (
        locationState?.isDemo ||
        (locationState?.treeId && locationState.treeId.startsWith("demo-"))
      ) {
        console.log("Demo tree detected - no longer supported");
        toast({
          title: "デモツリーは廃止されました",
          description: `リアルなツリー生成のみサポートしています。新しいツリーを生成してください。`,
        });
        return;
      }

      // Handle TED-generated tree (existing logic)
      if (locationState?.treeData && locationState?.tedResults) {
        console.log(
          "Initializing with TED-generated tree data:",
          locationState.treeData
        );
        
        // Set query from location state
        setCurrentQuery(locationState?.query || "");

        // Check if any fallback data was used
        const tedResults = locationState.tedResults;
        let hasFallbackData = false;

        if (
          tedResults.purpose?.layer?.generation_metadata?.coverage_note?.includes(
            "Fallback"
          ) ||
          tedResults.function?.layer?.generation_metadata?.coverage_note?.includes(
            "Fallback"
          ) ||
          tedResults.measure?.layer?.generation_metadata?.coverage_note?.includes(
            "Fallback"
          )
        ) {
          hasFallbackData = true;
          setShowFallbackAlert(true);
        }

        // Show success message with TED evaluation scores
        const scores = [];
        if (tedResults.purpose?.evaluation?.total_score) {
          scores.push(
            `Purpose: ${Math.round(
              tedResults.purpose.evaluation.total_score / 4
            )}%`
          );
        }
        if (tedResults.function?.evaluation?.total_score) {
          scores.push(
            `Function: ${Math.round(
              tedResults.function.evaluation.total_score / 4
            )}%`
          );
        }
        if (tedResults.measure?.evaluation?.total_score) {
          scores.push(
            `Measure: ${Math.round(
              tedResults.measure.evaluation.total_score / 4
            )}%`
          );
        }

        toast({
          title: hasFallbackData
            ? "TED Tree Generated with Templates"
            : "TED Tree Generated Successfully",
          description:
            scores.length > 0
              ? `Quality scores: ${scores.join(", ")}`
              : "Tree structure created successfully",
        });
      } // If no specific initialization is needed, just complete the initialization
      console.log(
        "No specific initialization required, completing initialization"
      );
      
      // Set query from location state if available
      if (locationState?.query) {
        setCurrentQuery(locationState.query);
      }
    };
    //console.log("Starting tree data initialization...");
    initializeTreeData().finally(() => {
      //console.log("Tree data initialization completed, setting isInitializing to false");
      setIsInitializing(false);
    });

    // Fallback timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      //console.log("Initialization timeout reached, forcing completion");
      setIsInitializing(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    locationState?.treeData,
    locationState?.tedResults,
    locationState?.fromDatabase,
    locationState?.fromPreset,
    locationState?.treeId,
    locationState?.query,
    hasLoadedDatabase, // Add this to prevent infinite loops
  ]);

  const {
    inputValue,
    chatMessages,
    isLoading,
    chatBoxOpen,
    chatBoxExpanded,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages,
    handleGuidanceClick,
    toggleChatBoxOpen,
    toggleChatBoxExpand,
  } = useTechTreeChat();

  const {
    isExpanded,
    toggleExpand,
    handleCheckResults,
    handleUseNode,
    handleEditNodeFromChat,
    handleRefineNode,
  } = useTechTreeSidebarActions(setChatMessages, addCustomNode, setSidebarTab);

  const selectedNodeInfo = useNodeInfo(
    selectedPath,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items
  );

  // Dynamic level names based on tree mode
  const treeMode =
    databaseTreeData?.mode || locationState?.treeData?.mode || "TED";
  const levelNames =
    treeMode === "FAST"
      ? {
          level1: "How1", // Level 1 = How1 (first implementation methods)
          level2: "How2", // Level 2 = How2 (detailed implementation)
          level3: "How3", // Level 3 = How3 (specific techniques)
          level4: "How4", // Level 4 = How4 (component details)
          level5: "How5", // Level 5 = How5 (sub-components)
          level6: "How6", // Level 6 = How6 (further details)
          level7: "How7", // Level 7 = How7 (implementation specifics - max depth)
        }
      : {
          level1: "シナリオ",
          level2: "目的",
          level3: "機能",
          level4: "手段",
          level5: "手段2",
          level6: "手段3",
          level7: "手段4",
          level8: "手段5",
          level9: "手段6",
          level10: "手段7",
        };

  const handlePanelResize = () => {
    const event = new CustomEvent("panel-resize");
    document.dispatchEvent(event);
  };

  // Initialize chat with context data
  useChatInitialization({
    locationState,
    chatMessages,
    setChatMessages,
    handleSwitchToChat,
  });

  // Handle node selection effects
  useNodeSelectionEffect({
    selectedPath,
    setShowSidebar,
    setSidebarTab,
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 overflow-hidden">
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
                scenario={databaseScenario || scenario}
                onEditScenario={handleEditScenario}
                conversationHistory={savedConversationHistory}
                handleAddLevel4={handleAddLevel4}
                searchMode={searchMode}
                onGuidanceClick={handleGuidanceClick}
                query={currentQuery || locationState?.query}
                treeMode={treeMode}
                onScrollToStart={handleScrollToStart}
                onScrollToEnd={handleScrollToEnd}
                canScrollLeft={canScrollLeft}
                canScrollRight={canScrollRight}
                lastVisibleLevel={lastVisibleLevel}
                containerRef={containerRef}
                triggerScrollUpdate={triggerScrollUpdate}
                viewMode={viewMode}
                onToggleView={toggleView}
              />
            </div>
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
            isOpen={chatBoxOpen}
            isExpanded={chatBoxExpanded}
            onToggleOpen={toggleChatBoxOpen}
            onToggleExpand={toggleChatBoxExpand}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TechnologyTree;
