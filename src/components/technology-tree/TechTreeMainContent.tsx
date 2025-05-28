
import { MainContent } from "./MainContent";

interface TechTreeMainContentProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  handleNodeClick: (level: string, nodeId: string) => void;
  editNode: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  deleteNode: (level: string, nodeId: string) => void;
  levelNames: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  hasUserMadeSelection: boolean;
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
  handleAddLevel4?: () => void;
  searchMode?: string;
}

export const TechTreeMainContent = ({
  selectedPath,
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
  onEditScenario,
  conversationHistory,
  handleAddLevel4,
  searchMode
}: TechTreeMainContentProps) => {
  return (
    <MainContent
      selectedPath={selectedPath}
      level1Items={level1Items}
      level2Items={level2Items}
      level3Items={level3Items}
      level4Items={level4Items}
      onNodeClick={handleNodeClick}
      onEditNode={editNode}
      onDeleteNode={deleteNode}
      levelNames={levelNames}
      hasUserMadeSelection={hasUserMadeSelection}
      scenario={scenario}
      onEditScenario={onEditScenario}
      conversationHistory={conversationHistory}
      onAddLevel4={handleAddLevel4}
      searchMode={searchMode}
    />
  );
};
