
import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScenarioCard } from './ScenarioCard';

interface LevelItem {
  id: string;
  name: string;
  info?: string;
  isCustom?: boolean;
  description?: string;
  children_count?: number;
}

interface DraggableCardProps {
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
  isExpanded: boolean;
  isLevelExpanded: (levelKey: string) => boolean;
  onToggleExpansion: () => void;
  onToggleLevelExpansion: (levelKey: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  isDraggable: boolean;
  level2Layout: "vertical" | "horizontal";
  onToggleLevel2Layout: () => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  scenario,
  selectedPath,
  level2Items,
  allLevelItems,
  levelNames,
  isExpanded,
  isLevelExpanded,
  onToggleExpansion,
  onToggleLevelExpansion,
  onExpandAll,
  onCollapseAll,
  onNodeClick,
  onEditNode,
  onDeleteNode,
  isDraggable,
  level2Layout,
  onToggleLevel2Layout,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: scenario.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isDraggable ? listeners : {})}
      className={isDragging ? 'z-50' : ''}
    >
      <ScenarioCard
        scenario={scenario}
        selectedPath={selectedPath}
        level2Items={level2Items}
        allLevelItems={allLevelItems}
        levelNames={levelNames}
        isExpanded={isExpanded}
        isLevelExpanded={isLevelExpanded}
        onToggleExpansion={onToggleExpansion}
        onToggleLevelExpansion={onToggleLevelExpansion}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        onNodeClick={onNodeClick}
        onEditNode={onEditNode}
        onDeleteNode={onDeleteNode}
        level2Layout={level2Layout}
        onToggleLevel2Layout={onToggleLevel2Layout}
      />
    </div>
  );
};
