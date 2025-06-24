import React, { useState, useEffect } from 'react';
import { LayoutToggle } from './LayoutToggle';
import { CardContainer } from './CardContainer';
import { useCardExpansion } from './hooks/useCardExpansion';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface CardBasedTreemapProps {
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
  level1Items: LevelItem[];
  level2Items: Record<string, LevelItem[]>;
  level3Items: Record<string, LevelItem[]>;
  level4Items: Record<string, LevelItem[]>;
  level5Items?: Record<string, LevelItem[]>;
  level6Items?: Record<string, LevelItem[]>;
  level7Items?: Record<string, LevelItem[]>;
  level8Items?: Record<string, LevelItem[]>;
  level9Items?: Record<string, LevelItem[]>;
  level10Items?: Record<string, LevelItem[]>;
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
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
}

type CardLayoutMode = "single-row" | "one-per-row" | "two-per-row" | "three-per-row";

export const CardBasedTreemap: React.FC<CardBasedTreemapProps> = ({
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
  levelNames = {
    level1: "シナリオ",
    level2: "目的",
    level3: "機能",
    level4: "手段",
  },
  onNodeClick,
  onEditNode,
  onDeleteNode,
}) => {
  const [cardLayout, setCardLayout] = useState<CardLayoutMode>("three-per-row");
  
  const {
    toggleScenarioExpansion,
    toggleLevelExpansion,
    expandAll,
    collapseAll,
    isScenarioExpanded,
    isLevelExpanded,
  } = useCardExpansion();

  // Add document-level wheel event debugging (keep for testing)
  useEffect(() => {
    const handleDocumentWheel = (e: WheelEvent) => {
      console.log('🟡 Document wheel event - TreeMap should allow scrolling');
      console.log('Target:', e.target);
      console.log('Target className:', (e.target as HTMLElement)?.className);
      console.log('Event timestamp:', Date.now());
    };
    
    document.addEventListener('wheel', handleDocumentWheel);
    return () => document.removeEventListener('wheel', handleDocumentWheel);
  }, []);

  // Add wheel event handler for treemap (same as mindmap)
  const handleContainerWheel = (e: React.WheelEvent) => {
    console.log('🔴 TreeMap onWheelCapture triggered');
    console.log('Target:', e.target);
    console.log('Target className:', (e.target as HTMLElement)?.className);
    console.log('CurrentTarget:', e.currentTarget);
    console.log('CurrentTarget className:', (e.currentTarget as HTMLElement)?.className);
    console.log('Event phase:', e.eventPhase);
    console.log('Event bubbles:', e.bubbles);
    console.log('Event timestamp:', Date.now());
    
    // Try all possible ways to stop event propagation
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    console.log('🔴 TreeMap event propagation stopped');
  };

  const allLevelItems = {
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
  };

  const getAllLevelKeys = (scenarioId: string): string[] => {
    const keys: string[] = [];
    
    const addKeysRecursively = (items: LevelItem[], prefix: string, level: number) => {
      items.forEach(item => {
        const key = `${prefix}-${item.id}`;
        keys.push(key);
        
        const nextLevelItems = level === 2 ? level3Items[item.id] :
                              level === 3 ? level4Items[item.id] :
                              level === 4 ? level5Items[item.id] :
                              level === 5 ? level6Items[item.id] :
                              level === 6 ? level7Items[item.id] :
                              level === 7 ? level8Items[item.id] :
                              level === 8 ? level9Items[item.id] :
                              level === 9 ? level10Items[item.id] : [];
        
        if (nextLevelItems?.length > 0) {
          addKeysRecursively(nextLevelItems, key, level + 1);
        }
      });
    };

    const scenarioLevel2Items = level2Items[scenarioId] || [];
    addKeysRecursively(scenarioLevel2Items, scenarioId, 2);
    return keys;
  };

  return (
    <div className="h-full overflow-hidden p-4 treemap-outer-container">
      <LayoutToggle 
        cardLayout={cardLayout}
        onLayoutChange={setCardLayout}
      />

      <div className="overflow-y-auto h-full">
        <CardContainer
          cardLayout={cardLayout}
          level1Items={level1Items}
          selectedPath={selectedPath}
          level2Items={level2Items}
          allLevelItems={allLevelItems}
          levelNames={levelNames}
          isScenarioExpanded={isScenarioExpanded}
          isLevelExpanded={isLevelExpanded}
          toggleScenarioExpansion={toggleScenarioExpansion}
          toggleLevelExpansion={toggleLevelExpansion}
          expandAll={expandAll}
          collapseAll={collapseAll}
          getAllLevelKeys={getAllLevelKeys}
          onNodeClick={onNodeClick}
          onEditNode={onEditNode}
          onDeleteNode={onDeleteNode}
        />
      </div>
    </div>
  );
};
