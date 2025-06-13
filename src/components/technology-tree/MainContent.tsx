
import React from "react";
import { PathDisplay } from "./PathDisplay";
import { LevelSelection } from "./LevelSelection";
import { ScenarioSection } from "./ScenarioSection";
import { QueryDisplay } from "./QueryDisplay";
import { MindMapContainer } from "./mindmap/MindMapContainer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TreePine, Network } from "lucide-react";

interface MainContentProps {
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
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  levelNames?: {
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
  query?: string;
  hasUserMadeSelection: boolean;
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
  onAddLevel4?: () => void;
  searchMode?: string;
  onGuidanceClick?: (type: string) => void;
  treeMode?: string;
  // Navigation control props
  onScrollToStart?: () => void;
  onScrollToEnd?: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  lastVisibleLevel?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  // View mode props - passed from parent
  viewMode: "treemap" | "mindmap";
  onToggleView: () => void;
}

export const MainContent = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  level4Items,
  level5Items = {},
  level6Items = {},
  level7Items = {},
  level8Items = {},
  level9Items = {},
  level10Items = {},
  showLevel4,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  },
  query,
  scenario,
  onEditScenario,
  hasUserMadeSelection,
  conversationHistory,
  onAddLevel4,
  searchMode,
  onGuidanceClick,
  treeMode,
  onScrollToStart,
  onScrollToEnd,
  canScrollLeft,
  canScrollRight,
  lastVisibleLevel,
  containerRef,
  viewMode,
  onToggleView,
}: MainContentProps) => {
  const isTreemapView = viewMode === "treemap";
  const isMindmapView = viewMode === "mindmap";

  const handleGuidanceItemClick = (type: string) => {
    if (onGuidanceClick) {
      onGuidanceClick(type);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 pt-2 pb-4 flex-shrink-0">
        {/* Query Display Section - appears first */}
        <QueryDisplay query={query} treeMode={treeMode} />

        {/* Title and Guidance Section */}
        <div className="mb-0" style={{ paddingTop: "0rem" }}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-gray-800"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                研究分野の階層表示
              </h3>
              
              {/* View Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleView}
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 px-2 py-1 h-7 text-xs"
              >
                {isTreemapView ? (
                  <>
                    <Network className="h-3 w-3" />
                    マインドマップ
                  </>
                ) : (
                  <>
                    <TreePine className="h-3 w-3" />
                    ツリーマップ
                  </>
                )}
              </Button>

              {/* DropdownMenu for guidance */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 px-2 py-1 h-7 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="12"
                      viewBox="0 0 11 12"
                      fill="none"
                      className="h-3 w-3"
                    >
                      <path
                        d="M5.6908 0.696533C4.64627 0.696533 3.62519 1.00627 2.75669 1.58658C1.8882 2.1669 1.21128 2.99171 0.811559 3.95674C0.411834 4.92176 0.307248 5.98364 0.511026 7.0081C0.714804 8.03257 1.21779 8.97359 1.95639 9.71219C2.69499 10.4508 3.63602 10.9538 4.66048 11.1576C5.68494 11.3613 6.74682 11.2567 7.71184 10.857C8.67687 10.4573 9.50169 9.78038 10.082 8.91189C10.6623 8.04339 10.972 7.02232 10.972 5.97778C10.9706 4.57756 10.4137 3.23511 9.42357 2.24501C8.43347 1.2549 7.09102 0.698012 5.6908 0.696533ZM5.6908 10.4465C4.80696 10.4465 3.94298 10.1844 3.20809 9.69341C2.47321 9.20238 1.90044 8.50446 1.56221 7.6879C1.22398 6.87134 1.13549 5.97283 1.30791 5.10597C1.48034 4.23912 1.90595 3.44287 2.53091 2.8179C3.15588 2.19293 3.95214 1.76733 4.81899 1.5949C5.68584 1.42247 6.58436 1.51097 7.40091 1.8492C8.21747 2.18743 8.91539 2.7602 9.40643 3.49508C9.89746 4.22996 10.1595 5.09395 10.1595 5.97778C10.1582 7.16256 9.68696 8.29842 8.8492 9.13618C8.01143 9.97394 6.87557 10.4452 5.6908 10.4465ZM6.5033 8.41528C6.5033 8.52303 6.4605 8.62636 6.38431 8.70255C6.30812 8.77873 6.20479 8.82153 6.09705 8.82153C5.88156 8.82153 5.6749 8.73593 5.52252 8.58356C5.37015 8.43118 5.28455 8.22452 5.28455 8.00903V5.97778C5.1768 5.97778 5.07347 5.93498 4.99729 5.85879C4.9211 5.78261 4.8783 5.67928 4.8783 5.57153C4.8783 5.46379 4.9211 5.36046 4.99729 5.28427C5.07347 5.20808 5.1768 5.16528 5.28455 5.16528C5.50004 5.16528 5.7067 5.25089 5.85907 5.40326C6.01145 5.55563 6.09705 5.76229 6.09705 5.97778V8.00903C6.20479 8.00903 6.30812 8.05183 6.38431 8.12802C6.4605 8.20421 6.5033 8.30754 6.5033 8.41528ZM4.8783 3.74341C4.8783 3.62288 4.91404 3.50507 4.981 3.40486C5.04795 3.30465 5.14313 3.22654 5.25448 3.18042C5.36582 3.1343 5.48835 3.12223 5.60656 3.14574C5.72476 3.16925 5.83334 3.22729 5.91857 3.31251C6.00379 3.39774 6.06183 3.50632 6.08534 3.62452C6.10885 3.74273 6.09678 3.86526 6.05066 3.97661C6.00454 4.08795 5.92643 4.18313 5.82622 4.25008C5.72601 4.31704 5.6082 4.35278 5.48767 4.35278C5.32606 4.35278 5.17106 4.28858 5.05678 4.1743C4.9425 4.06002 4.8783 3.90502 4.8783 3.74341Z"
                        fill="#3862D7"
                      />
                    </svg>
                    ガイダンス
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleGuidanceItemClick('treemap-usage')}
                  >
                    Treemapの使い方
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    研究シナリオを生成について
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Scenario Section */}
        <ScenarioSection
          scenario={scenario}
          onEditScenario={onEditScenario}
          conversationHistory={conversationHistory}
          onGuidanceClick={onGuidanceClick}
        />

        {/* Path Display - now shows for both treemap and mindmap views with viewMode prop */}
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
          onGuidanceClick={onGuidanceClick}
          onScrollToStart={onScrollToStart}
          onScrollToEnd={onScrollToEnd}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          lastVisibleLevel={lastVisibleLevel}
          viewMode={viewMode}
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isTreemapView ? (
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
            onNodeClick={onNodeClick}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
            levelNames={levelNames}
            hideNavigationControls={true}
            containerRef={containerRef}
            onGuidanceClick={onGuidanceClick}
          />
        ) : (
          <MindMapContainer
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
            levelNames={levelNames}
            query={query}
            onNodeClick={onNodeClick}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
          />
        )}
      </div>
    </div>
  );
};
