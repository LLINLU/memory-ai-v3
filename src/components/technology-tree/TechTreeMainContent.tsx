
import { MainContent } from "./MainContent";

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
}

export const TechTreeMainContent = ({
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
}: TechTreeMainContentProps) => {
  return (
    <MainContent
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
      onGuidanceClick={onGuidanceClick}
      query={query}
    />
  );
};
