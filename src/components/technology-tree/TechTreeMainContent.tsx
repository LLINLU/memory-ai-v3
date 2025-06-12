import { useEffect, useState } from "react";
import { MainContent } from "./MainContent";
import { ScenarioSection } from "./ScenarioSection";
import { ViewToggle } from "./ViewToggle";
import { NavigationControls } from "./level-selection/NavigationControls";
import { LevelSelection } from "./LevelSelection";
import { MindMapContainer } from "./mind-map/MindMapContainer";
import { PathDisplay } from "./PathDisplay";

interface TechTreeMainContentProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  level5Items?: Record<string, any[]>;
  level6Items?: Record<string, any[]>;
  level7Items?: Record<string, any[]>;
  level8Items?: Record<string, any[]>;
  level9Items?: Record<string, any[]>;
  level10Items?: Record<string, any[]>;
  showLevel4: boolean;
  handleNodeClick: (level: string, nodeId: string) => void;
  editNode: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  deleteNode: (level: string, nodeId: string) => void;
  levelNames: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  hasUserMadeSelection: boolean;
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
  handleAddLevel4?: () => void;
  searchMode?: string;
  onGuidanceClick?: (type: string) => void;
  query?: string;
  treeMode?: string;
  // Navigation control props
  onScrollToStart?: () => void;
  onScrollToEnd?: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  lastVisibleLevel?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  triggerScrollUpdate?: () => void;
}

export const TechTreeMainContent: React.FC<TechTreeMainContentProps> = ({
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
  level10Items,
  showLevel4,
  handleNodeClick,
  editNode,
  deleteNode,
  levelNames,
  hasUserMadeSelection,
  scenario,
  onEditScenario,
  conversationHistory,
  handleAddLevel4,
  searchMode,
  onGuidanceClick,
  query,
  treeMode,
  onScrollToStart,
  onScrollToEnd,
  canScrollLeft,
  canScrollRight,
  lastVisibleLevel,
  containerRef,
  triggerScrollUpdate,
}) => {
  const [currentView, setCurrentView] = useState<"treemap" | "mindmap">("treemap");

  // Debug logging for view changes
  useEffect(() => {
    console.log("🎨 View changed to:", currentView);
    console.log("📊 Current data:", {
      level1Count: level1Items?.length || 0,
      level2Count: Object.keys(level2Items || {}).length,
      level3Count: Object.keys(level3Items || {}).length,
      level4Count: Object.keys(level4Items || {}).length,
    });
  }, [currentView, level1Items, level2Items, level3Items, level4Items]);

  const handleViewChange = (view: "treemap" | "mindmap") => {
    console.log("🔄 Switching view to:", view);
    setCurrentView(view);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Section */}
      {scenario && (
        <div className="bg-white rounded-lg shadow-sm border">
          <ScenarioSection 
            scenario={scenario} 
            onEditScenario={onEditScenario}
            conversationHistory={conversationHistory}
            onGuidanceClick={onGuidanceClick}
          />
        </div>
      )}

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
        
        {currentView === "treemap" && (
          <NavigationControls
            onScrollToStart={onScrollToStart}
            onScrollToEnd={onScrollToEnd}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            lastVisibleLevel={lastVisibleLevel}
          />
        )}
      </div>

      {/* Conditional Rendering */}
      {currentView === "treemap" ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <LevelSelection
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
            handleAddLevel4={handleAddLevel4}
            searchMode={searchMode}
            onGuidanceClick={onGuidanceClick}
            query={query}
            treeMode={treeMode}
            containerRef={containerRef}
            triggerScrollUpdate={triggerScrollUpdate}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border h-[600px]">
          <MindMapContainer
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
            selectedPath={selectedPath}
            onNodeClick={handleNodeClick}
            onEditNode={editNode}
            onDeleteNode={deleteNode}
          />
        </div>
      )}

      {/* Path Display Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <PathDisplay
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
          conversationHistory={conversationHistory}
          onAddLevel4={handleAddLevel4}
          searchMode={searchMode}
          onGuidanceClick={onGuidanceClick}
          query={query}
          treeMode={treeMode}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
};
