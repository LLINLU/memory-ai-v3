
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
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
  isDraggable?: boolean;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  scenario,
  isDraggable = false,
  ...cardProps
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
    opacity: isDragging ? 0.5 : 1,
  };

  if (!isDraggable) {
    return (
      <ScenarioCard
        scenario={scenario}
        {...cardProps}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Drag Handle - improved visibility for grid layouts */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing bg-white/95 backdrop-blur-sm rounded-md p-1.5 shadow-md border border-gray-200 hover:border-gray-300"
      >
        <GripVertical className="h-4 w-4 text-gray-600" />
      </div>

      <ScenarioCard
        scenario={scenario}
        {...cardProps}
      />
    </div>
  );
};
