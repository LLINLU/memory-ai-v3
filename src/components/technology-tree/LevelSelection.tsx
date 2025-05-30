
import React, { useState, useEffect } from "react";
import { LevelColumn } from "./level-selection/LevelColumn";
import { LevelGrid } from "./level-selection/LevelGrid";
import { LevelConnectionLines } from "./level-selection/LevelConnectionLines";
import { useConnectionLines } from "./level-selection/useConnectionLines";
import { useLevelItemsReordering } from "@/hooks/tree/useLevelItemsReordering";
import { useLevelSelectionHandlers } from "@/hooks/tree/useLevelSelectionHandlers";

interface LevelItem {
  id: string;
  name: string;
  info?: string;
}

interface LevelSelectionProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  };
  level1Items: LevelItem[];
  level2Items: Record<string, LevelItem[]>;
  level3Items: Record<string, LevelItem[]>;
  level4Items?: Record<string, LevelItem[]>;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (level: string, nodeId: string, updatedNode: { title: string; description: string }) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
  showLevel4?: boolean;
  levelNames: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  };
}

export const LevelSelection = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  level4Items = {},
  onNodeClick,
  onEditNode,
  onDeleteNode,
  showLevel4 = false,
  levelNames
}: LevelSelectionProps) => {
  // Use custom hooks for logic separation
  const {
    reorderedLevel1Items,
    visibleLevel2Items,
    visibleLevel3Items,
    visibleLevel4Items
  } = useLevelItemsReordering(
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    selectedPath,
    showLevel4
  );

  const {
    containerRef,
    handleNodeSelection,
    handleEditNode,
    handleDeleteNode
  } = useLevelSelectionHandlers(selectedPath, onNodeClick, onEditNode, onDeleteNode);

  // Connection lines state
  const [level2to3Line, setLevel2to3Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [level1to2Line, setLevel1to2Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [level3to4Line, setLevel3to4Line] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  
  useConnectionLines(containerRef, selectedPath, setLevel1to2Line, setLevel2to3Line, setLevel3to4Line);

  return (
    <div ref={containerRef}>
      <LevelGrid showLevel4={showLevel4}>
        <LevelColumn
          title="レベル1"
          subtitle={levelNames.level1}
          items={reorderedLevel1Items}
          selectedId={selectedPath.level1}
          onNodeClick={(nodeId) => handleNodeSelection('level1', nodeId)}
          onEditNode={(nodeId, updatedNode) => handleEditNode('level1', nodeId, updatedNode)}
          onDeleteNode={(nodeId) => handleDeleteNode('level1', nodeId)}
        />

        <LevelColumn
          title="レベル2"
          subtitle={levelNames.level2}
          items={visibleLevel2Items}
          selectedId={selectedPath.level2}
          onNodeClick={(nodeId) => handleNodeSelection('level2', nodeId)}
          onEditNode={(nodeId, updatedNode) => handleEditNode('level2', nodeId, updatedNode)}
          onDeleteNode={(nodeId) => handleDeleteNode('level2', nodeId)}
        />

        <LevelColumn
          title="レベル3"
          subtitle={levelNames.level3}
          items={visibleLevel3Items}
          selectedId={selectedPath.level3}
          onNodeClick={(nodeId) => handleNodeSelection('level3', nodeId)}
          onEditNode={(nodeId, updatedNode) => handleEditNode('level3', nodeId, updatedNode)}
          onDeleteNode={(nodeId) => handleDeleteNode('level3', nodeId)}
        />

        {showLevel4 && (
          <LevelColumn
            title="レベル4"
            subtitle={levelNames.level4 || "実装"}
            items={visibleLevel4Items}
            selectedId={selectedPath.level4}
            onNodeClick={(nodeId) => handleNodeSelection('level4', nodeId)}
            onEditNode={(nodeId, updatedNode) => handleEditNode('level4', nodeId, updatedNode)}
            onDeleteNode={(nodeId) => handleDeleteNode('level4', nodeId)}
          />
        )}

        <LevelConnectionLines
          level1to2Line={level1to2Line}
          level2to3Line={level2to3Line}
          level3to4Line={level3to4Line}
        />
      </LevelGrid>
    </div>
  );
};
