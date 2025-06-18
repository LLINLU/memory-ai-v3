
import { useState, useCallback } from 'react';

interface ExpansionState {
  [scenarioId: string]: {
    isExpanded: boolean;
    expandedLevels: {
      [levelKey: string]: boolean;
    };
  };
}

export const useCardExpansion = () => {
  const [expansionState, setExpansionState] = useState<ExpansionState>({});

  const toggleScenarioExpansion = useCallback((scenarioId: string) => {
    setExpansionState(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        isExpanded: !prev[scenarioId]?.isExpanded,
        expandedLevels: prev[scenarioId]?.expandedLevels || {},
      },
    }));
  }, []);

  const toggleLevelExpansion = useCallback((scenarioId: string, levelKey: string) => {
    setExpansionState(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        isExpanded: prev[scenarioId]?.isExpanded || false,
        expandedLevels: {
          ...prev[scenarioId]?.expandedLevels,
          [levelKey]: !prev[scenarioId]?.expandedLevels?.[levelKey],
        },
      },
    }));
  }, []);

  const expandAll = useCallback((scenarioId: string, levelKeys: string[]) => {
    setExpansionState(prev => {
      const expandedLevels: { [key: string]: boolean } = {};
      levelKeys.forEach(key => {
        expandedLevels[key] = true;
      });

      return {
        ...prev,
        [scenarioId]: {
          isExpanded: true,
          expandedLevels,
        },
      };
    });
  }, []);

  const collapseAll = useCallback((scenarioId: string) => {
    setExpansionState(prev => ({
      ...prev,
      [scenarioId]: {
        isExpanded: false,
        expandedLevels: {},
      },
    }));
  }, []);

  // Enhanced auto-expand function that expands all nodes with children up to level 4
  const autoExpandWithChildren = useCallback((
    allScenarios: any[],
    level2Items: Record<string, any[]>,
    allLevelItems: {
      level3Items: Record<string, any[]>;
      level4Items: Record<string, any[]>;
      level5Items: Record<string, any[]>;
      level6Items: Record<string, any[]>;
      level7Items: Record<string, any[]>;
      level8Items: Record<string, any[]>;
      level9Items: Record<string, any[]>;
      level10Items: Record<string, any[]>;
    }
  ) => {
    console.log(`[EXPANSION DEBUG] Auto-expanding all scenarios with level 4 data`);
    
    const newExpansionState: ExpansionState = {};
    
    // Process each scenario
    allScenarios.forEach(scenario => {
      const scenarioId = scenario.id;
      const scenarioLevel2Items = level2Items[scenarioId] || [];
      
      // Check if this scenario has any level 4 data
      const hasLevel4Data = scenarioLevel2Items.some(level2Item => {
        const level3Children = allLevelItems.level3Items[level2Item.id] || [];
        return level3Children.some(level3Item => {
          const level4Children = allLevelItems.level4Items[level3Item.id] || [];
          return level4Children.length > 0;
        });
      });

      if (hasLevel4Data) {
        console.log(`[EXPANSION DEBUG] Found level 4 data in scenario: ${scenario.name}`);
        
        const expandedLevels: { [key: string]: boolean } = {};
        
        // Auto-expand level 2 items that have level 3 children
        scenarioLevel2Items.forEach(level2Item => {
          const level3Children = allLevelItems.level3Items[level2Item.id] || [];
          if (level3Children.length > 0) {
            const level2Key = `${scenarioId}-${level2Item.id}`;
            expandedLevels[level2Key] = true;
            console.log(`[EXPANSION DEBUG] Auto-expanding level 2 key: ${level2Key}`);
            
            // Auto-expand level 3 items that have level 4 children
            level3Children.forEach(level3Item => {
              const level4Children = allLevelItems.level4Items[level3Item.id] || [];
              if (level4Children.length > 0) {
                const level3Key = `${level2Key}-${level3Item.id}`;
                expandedLevels[level3Key] = true;
                console.log(`[EXPANSION DEBUG] Auto-expanding level 3 key: ${level3Key} (has ${level4Children.length} level 4 children)`);
              }
            });
          }
        });

        newExpansionState[scenarioId] = {
          isExpanded: true,
          expandedLevels,
        };
      }
    });

    setExpansionState(prev => ({
      ...prev,
      ...newExpansionState,
    }));
  }, []);

  const isScenarioExpanded = useCallback((scenarioId: string) => {
    return expansionState[scenarioId]?.isExpanded || false;
  }, [expansionState]);

  const isLevelExpanded = useCallback((scenarioId: string, levelKey: string) => {
    return expansionState[scenarioId]?.expandedLevels?.[levelKey] || false;
  }, [expansionState]);

  return {
    toggleScenarioExpansion,
    toggleLevelExpansion,
    expandAll,
    collapseAll,
    autoExpandWithChildren,
    isScenarioExpanded,
    isLevelExpanded,
  };
};
