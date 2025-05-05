
import React from "react";
import { MainContent } from "@/components/technology-tree/MainContent";
import { TreeNode } from "@/types/tree";

interface LevelNames {
  level1: string;
  level2: string;
  level3: string;
}

interface TechTreeMainContentProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
  };
  level1Items: TreeNode[];
  level2Items: Record<string, TreeNode[]>;
  level3Items: Record<string, TreeNode[]>;
  handleNodeClick: (level: string, nodeId: string) => void;
  editNode: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  deleteNode: (level: string, nodeId: string) => void;
  levelNames: LevelNames;
  hasUserMadeSelection: boolean;
  scenario: string;
  onEditScenario: () => void;
}

export const TechTreeMainContent: React.FC<TechTreeMainContentProps> = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  handleNodeClick,
  editNode,
  deleteNode,
  levelNames,
  hasUserMadeSelection,
  scenario,
  onEditScenario
}) => {
  return (
    <MainContent
      selectedPath={selectedPath}
      level1Items={level1Items}
      level2Items={level2Items}
      level3Items={level3Items}
      onNodeClick={handleNodeClick}
      onEditNode={editNode}
      onDeleteNode={deleteNode}
      levelNames={levelNames}
      hasUserMadeSelection={hasUserMadeSelection}
      scenario={scenario}
      onEditScenario={onEditScenario}
    />
  );
};
