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

  // Store the conversation history from the research context
  const [savedConversationHistory, setSavedConversationHistory] = useState<
    any[]
  >([]);
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);
  const [databaseTreeData, setDatabaseTreeData] = useState<any>(null);
  const [hasLoadedDatabase, setHasLoadedDatabase] = useState(false);
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
    handleAddLevel4,
    scenario: databaseScenario, // Get scenario from database tree data
  } = useTechnologyTree(databaseTreeData);
  // Initialize tree data with TED results if available
  useEffect(() => {
    const initializeTreeData = async () => {
      // Helper function to validate UUID format
      const isValidUUID = (str: string) => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      };

      // Handle database-generated tree (only if it's a valid UUID and not a demo)
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
        }        console.log("Loading tree from database, ID:", locationState.treeId);
        setHasLoadedDatabase(true); // Prevent re-loading
        
        try {
          const result = await loadTreeFromDatabase(locationState.treeId);
          if (result?.treeStructure) {
            const convertedData = convertDatabaseTreeToAppFormat(
              result.treeStructure,
              {
                description: result.treeData?.description,
                search_theme: result.treeData?.search_theme,
                name: result.treeData?.name
              }
            );
            if (convertedData) {
              console.log(
                "Successfully converted database tree data:",
                convertedData
              );
              setDatabaseTreeData(convertedData);
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
      }

      // Handle preset technology trees from sidebar
      if (locationState?.fromPreset && locationState?.treeId) {
        console.log(
          "Loading preset technology tree, ID:",
          locationState.treeId
        );

        // Import the technology tree data dynamically
        import("@/data/technologyTreeData")
          .then(({ level1Items, level2Items, level3Items }) => {
            const level1Item = level1Items.find(
              (item) => item.id === locationState.treeId
            );

            if (level1Item) {
              // Create a simplified tree structure for preset trees
              const presetTreeData = {
                level1Items,
                level2Items,
                level3Items,
                selectedLevel1: locationState.treeId,
                searchTheme: level1Item.name,
                isPreset: true,
              };

              console.log(
                "Successfully loaded preset tree data:",
                presetTreeData
              );
              setDatabaseTreeData(presetTreeData);

              toast({
                title: "プリセット技術ツリーを読み込みました",
                description: `${level1Item.name} の技術ツリーを表示しています。`,
              });
            } else {
              console.error("Preset tree not found:", locationState.treeId);
              toast({
                title: "プリセットツリーが見つかりません",
                description: "指定された技術ツリーが存在しません。",
              });
            }
          })
          .catch((error) => {
            console.error("Error loading preset tree data:", error);
            toast({
              title: "プリセットツリーの読み込みエラー",
              description: "技術ツリーデータの読み込みに失敗しました。",
            });
          });

        return;
      }

      // Handle demo trees or trees with demo IDs - show error instead of demo mode
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
      }
    };

    initializeTreeData();
  }, [
    locationState?.treeData,
    locationState?.tedResults,
    locationState?.fromDatabase,
    locationState?.fromPreset,
    locationState?.treeId,
    hasLoadedDatabase, // Add this to prevent infinite loops
  ]);

  const {
    inputValue,
    chatMessages,
    isLoading,
    handleInputChange,
    handleSendMessage,
    initializeChat,
    handleSwitchToChat,
    handleButtonClick,
    setChatMessages,
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
    level3Items
  );  const levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
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
            <div className="p-4">
              <FallbackAlert
                isVisible={showFallbackAlert}
                onDismiss={() => setShowFallbackAlert(false)}
              />              <TechTreeMainContent
                selectedPath={selectedPath}
                level1Items={level1Items}
                level2Items={level2Items}
                level3Items={level3Items}
                level4Items={level4Items}
                showLevel4={showLevel4}
                handleNodeClick={handleNodeClick}
                editNode={editNode}
                deleteNode={deleteNode}
                levelNames={levelNames}
                hasUserMadeSelection={hasUserMadeSelection}                scenario={databaseScenario || scenario}
                onEditScenario={handleEditScenario}
                conversationHistory={savedConversationHistory}
                handleAddLevel4={handleAddLevel4}
                searchMode={searchMode}
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
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TechnologyTree;
