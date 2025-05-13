
import React, { useEffect } from 'react';
import { PathDisplay } from "./PathDisplay";
import { LevelSelection } from "./LevelSelection";
import { ScenarioSection } from "./ScenarioSection";
import { ScrollArea } from "../ui/scroll-area";
import { SearchResults } from "./SearchResults";

interface MainContentProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  levelNames?: {
    level1: string;
    level2: string;
    level3: string;
  };
  query?: string;
  hasUserMadeSelection: boolean;
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[]; 
}

export const MainContent = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  levelNames = {
    level1: "目的",
    level2: "機能",
    level3: "測定/技術"
  },
  query,
  scenario,
  onEditScenario,
  hasUserMadeSelection,
  conversationHistory
}: MainContentProps) => {
  // Calculate selected node info to pass to SearchResults
  const getSelectedNodeInfo = () => {
    let title = '';
    let description = '';
    
    if (selectedPath.level3 && level3Items[selectedPath.level2]) {
      const node = level3Items[selectedPath.level2].find(item => item.id === selectedPath.level3);
      if (node) {
        title = node.name;
        description = node.info || '';
      }
    } else if (selectedPath.level2 && level2Items[selectedPath.level1]) {
      const node = level2Items[selectedPath.level1].find(item => item.id === selectedPath.level2);
      if (node) {
        title = node.name;
        description = node.info || '';
      }
    } else if (selectedPath.level1) {
      const node = level1Items.find(item => item.id === selectedPath.level1);
      if (node) {
        title = node.name;
        description = node.info || '';
      }
    }
    
    return { title, description };
  };
  
  const selectedNodeInfo = getSelectedNodeInfo();
  
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-full">
      {/* Fixed header section that doesn't scroll */}
      <div className="flex-none">
        <ScenarioSection scenario={scenario} onEditScenario={onEditScenario} conversationHistory={conversationHistory} />
        <PathDisplay 
          selectedPath={selectedPath}
          level1Items={level1Items}
          level2Items={level2Items}
          level3Items={level3Items}
        />
        <LevelSelection
          selectedPath={selectedPath}
          level1Items={level1Items}
          level2Items={level2Items}
          level3Items={level3Items}
          onNodeClick={onNodeClick}
          onEditNode={onEditNode}
          onDeleteNode={onDeleteNode}
          levelNames={levelNames}
        />
      </div>
      
      {/* Scrollable content area that contains the search results */}
      <div className="flex-1 overflow-hidden mt-6">
        <ScrollArea className="h-full">
          <SearchResults 
            selectedNodeTitle={selectedNodeInfo.title}
            selectedNodeDescription={selectedNodeInfo.description}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
