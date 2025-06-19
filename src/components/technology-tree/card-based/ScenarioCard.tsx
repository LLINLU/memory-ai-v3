import React from 'react';
import { ChevronDown, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TreeNode } from '../level-selection/TreeNode';
import { NestedLevelGroup } from './NestedLevelGroup';
import { getLevelBadgeStyle } from '../utils/levelColors';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface ScenarioCardProps {
  scenario: LevelItem;
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
  level2Items: LevelItem[];
  allLevelItems: {
    level3Items: Record<string, LevelItem[]>;
    level4Items: Record<string, LevelItem[]>;
    level5Items: Record<string, LevelItem[]>;
    level6Items: Record<string, LevelItem[]>;
    level7Items: Record<string, LevelItem[]>;
    level8Items: Record<string, LevelItem[]>;
    level9Items: Record<string, LevelItem[]>;
    level10Items: Record<string, LevelItem[]>;
  };
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
  isExpanded: boolean;
  isLevelExpanded: (levelKey: string) => boolean;
  onToggleExpansion: () => void;
  onToggleLevelExpansion: (levelKey: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  selectedPath,
  level2Items,
  allLevelItems,
  levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  },
  isExpanded,
  isLevelExpanded,
  onToggleExpansion,
  onToggleLevelExpansion,
  onExpandAll,
  onCollapseAll,
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const isSelected = selectedPath.level1 === scenario.id;
  const hasChildren = level2Items.length > 0;

  const handleScenarioClick = () => {
    onNodeClick('level1', scenario.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditNode) {
      onEditNode('level1', scenario.id, { title: scenario.name, description: scenario.description || '' });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteNode) {
      onDeleteNode('level1', scenario.id);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add functionality for scenario card
  };

  const handleAiAssistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement AI assist functionality for scenario card
  };

  const getAllLevelKeys = (): string[] => {
    const keys: string[] = [];
    
    const addKeysRecursively = (items: LevelItem[], prefix: string, level: number) => {
      items.forEach(item => {
        const key = `${prefix}-${item.id}`;
        keys.push(key);
        
        const nextLevelItems = level === 2 ? allLevelItems.level3Items[item.id] :
                              level === 3 ? allLevelItems.level4Items[item.id] :
                              level === 4 ? allLevelItems.level5Items[item.id] :
                              level === 5 ? allLevelItems.level6Items[item.id] :
                              level === 6 ? allLevelItems.level7Items[item.id] :
                              level === 7 ? allLevelItems.level8Items[item.id] :
                              level === 8 ? allLevelItems.level9Items[item.id] :
                              level === 9 ? allLevelItems.level10Items[item.id] : [];
        
        if (nextLevelItems?.length > 0) {
          addKeysRecursively(nextLevelItems, key, level + 1);
        }
      });
    };

    addKeysRecursively(level2Items, scenario.id, 2);
    return keys;
  };

  return (
    <Card className="w-full relative">
      <CardHeader className="pb-3">
        {/* Top row: Expand/Collapse button positioned at top-right */}
        {hasChildren && (
          <div className="absolute top-4 right-4 z-10">
            <TooltipProvider delayDuration={200} skipDelayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isExpanded ? onCollapseAll : onExpandAll}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>すべて展開</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Main content row */}
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={onToggleExpansion}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
          <div className="flex-1">
            <div className="mb-2">
              <Badge variant="outline" className={`text-xs ${getLevelBadgeStyle(1)}`}>
                レベル1:{levelNames.level1}
              </Badge>
            </div>
            <TreeNode
              item={scenario}
              isSelected={isSelected}
              onClick={handleScenarioClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onAddClick={handleAddClick}
              onAiAssistClick={handleAiAssistClick}
              level={1}
              showDescription={true}
              subNodeCount={level2Items.length}
              isLastLevel={!hasChildren}
            />
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && hasChildren && (
        <CardContent className="pt-0">
          <NestedLevelGroup
            items={level2Items}
            selectedPath={selectedPath}
            scenarioId={scenario.id}
            currentLevel={2}
            levelKey={scenario.id}
            nextLevelItems={allLevelItems.level3Items}
            allLevelItems={allLevelItems}
            levelNames={levelNames}
            onNodeClick={onNodeClick}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
            isLevelExpanded={isLevelExpanded}
            toggleLevelExpansion={onToggleLevelExpansion}
          />
        </CardContent>
      )}
    </Card>
  );
};
