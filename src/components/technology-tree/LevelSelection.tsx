
import React, { useState, useEffect } from "react";
import { LevelColumn } from "./level-selection/LevelColumn";
import { ConnectionLines } from "./level-selection/ConnectionLines";
import { NavigationControls } from "./level-selection/NavigationControls";
import { useConnectionLines } from "./level-selection/useConnectionLines";
import { toast } from "@/hooks/use-toast";

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
  showLevel4: boolean;
  onNodeClick: (level: string, nodeId: string) => void;
  onEditNode?: (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => void;
  onDeleteNode?: (level: string, nodeId: string) => void;
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
  hideNavigationControls?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const LevelSelection = ({
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
  onNodeClick,
  onEditNode,
  onDeleteNode,
  levelNames,
  hideNavigationControls = false,
  containerRef,
}: LevelSelectionProps) => {
  // Reorder items to ensure selected items appear first
  const reorderedLevel1Items = React.useMemo(() => {
    const items = [...level1Items];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level1
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level1Items, selectedPath.level1]);

  const visibleLevel2Items = React.useMemo(() => {
    if (!selectedPath.level1) return [];
    const items = [...(level2Items[selectedPath.level1] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level2
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level2Items, selectedPath]);

  const visibleLevel3Items = React.useMemo(() => {
    if (!selectedPath.level2) return [];
    const items = [...(level3Items[selectedPath.level2] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level3
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level3Items, selectedPath]);

  const visibleLevel4Items = React.useMemo(() => {
    if (!selectedPath.level3) return [];
    const items = [...(level4Items[selectedPath.level3] || [])];

    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level4
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level4Items, selectedPath]);

  const visibleLevel5Items = React.useMemo(() => {
    if (!selectedPath.level4) return [];
    const items = [...(level5Items[selectedPath.level4] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level5
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level5Items, selectedPath]);

  const visibleLevel6Items = React.useMemo(() => {
    if (!selectedPath.level5) return [];
    const items = [...(level6Items[selectedPath.level5] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level6
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level6Items, selectedPath]);

  const visibleLevel7Items = React.useMemo(() => {
    if (!selectedPath.level6) return [];
    const items = [...(level7Items[selectedPath.level6] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level7
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level7Items, selectedPath]);

  const visibleLevel8Items = React.useMemo(() => {
    if (!selectedPath.level7) return [];
    const items = [...(level8Items[selectedPath.level7] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level8
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level8Items, selectedPath]);

  const visibleLevel9Items = React.useMemo(() => {
    if (!selectedPath.level8) return [];
    const items = [...(level9Items[selectedPath.level8] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level9
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level9Items, selectedPath]);

  const visibleLevel10Items = React.useMemo(() => {
    if (!selectedPath.level9) return [];
    const items = [...(level10Items[selectedPath.level9] || [])];
    const selectedIndex = items.findIndex(
      (item) => item.id === selectedPath.level10
    );
    if (selectedIndex > 0) {
      const [selectedItem] = items.splice(selectedIndex, 1);
      items.unshift(selectedItem);
    }
    return items;
  }, [level10Items, selectedPath]);

  const [level1to2Line, setLevel1to2Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level2to3Line, setLevel2to3Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level3to4Line, setLevel3to4Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level4to5Line, setLevel4to5Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level5to6Line, setLevel5to6Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level6to7Line, setLevel6to7Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level7to8Line, setLevel7to8Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level8to9Line, setLevel8to9Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [level9to10Line, setLevel9to10Line] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  useConnectionLines(
    containerRef,
    selectedPath,
    setLevel1to2Line,
    setLevel2to3Line,
    setLevel3to4Line,
    setLevel4to5Line,
    setLevel5to6Line,
    setLevel6to7Line,
    setLevel7to8Line,
    setLevel8to9Line,
    setLevel9to10Line
  );

  // Calculate the last visible level
  const getLastVisibleLevel = () => {
    if (visibleLevel10Items.length > 0) return 10;
    if (visibleLevel9Items.length > 0) return 9;
    if (visibleLevel8Items.length > 0) return 8;
    if (visibleLevel7Items.length > 0) return 7;
    if (visibleLevel6Items.length > 0) return 6;
    if (visibleLevel5Items.length > 0) return 5;
    if (visibleLevel4Items.length > 0) return 4;
    if (visibleLevel3Items.length > 0) return 3;
    if (visibleLevel2Items.length > 0) return 2;
    return 1;
  };

  const lastVisibleLevel = getLastVisibleLevel();

  const handleNodeSelection = (level: string, nodeId: string) => {
    if (selectedPath[level] !== nodeId) {
      // Create custom event to refresh paper list with node information
      const refreshEvent = new CustomEvent("refresh-papers", {
        detail: { level, nodeId, timestamp: Date.now() },
      });
      document.dispatchEvent(refreshEvent);

      // Show notification to user with 1-second duration
      toast({
        title: "Results updated",
        description: "The paper list has been updated based on your selection",
        duration: 1000,
      });

      console.log("Node selection event:", { level, nodeId, refreshEvent });
    }

    onNodeClick(level, nodeId);
  };

  const handleEditNode = (
    level: string,
    nodeId: string,
    updatedNode: { title: string; description: string }
  ) => {
    if (onEditNode) {
      onEditNode(level, nodeId, updatedNode);
      toast({
        title: "Node updated",
        description: `Changes to "${updatedNode.title}" have been saved`,
        duration: 2000,
      });
    }
  };

  const handleDeleteNode = (level: string, nodeId: string) => {
    if (onDeleteNode) {
      onDeleteNode(level, nodeId);
      toast({
        title: "ノードが削除されました",
        description: "ノードは正常に削除されました",
        duration: 2000,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Horizontal scrollable container */}
      <div
        className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4 px-4"
        ref={containerRef}
        style={{
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
        }}
      >
        <LevelColumn
          title="レベル1"
          subtitle={levelNames.level1}
          items={reorderedLevel1Items}
          selectedId={selectedPath.level1}
          onNodeClick={(nodeId) => handleNodeSelection("level1", nodeId)}
          onEditNode={(nodeId, updatedNode) =>
            handleEditNode("level1", nodeId, updatedNode)
          }
          onDeleteNode={(nodeId) => handleDeleteNode("level1", nodeId)}
          selectedPath={selectedPath}
          nextLevelItems={level2Items}
          isLastLevel={lastVisibleLevel === 1}
        />
        <LevelColumn
          title="レベル2"
          subtitle={levelNames.level2}
          items={visibleLevel2Items}
          selectedId={selectedPath.level2}
          onNodeClick={(nodeId) => handleNodeSelection("level2", nodeId)}
          onEditNode={(nodeId, updatedNode) =>
            handleEditNode("level2", nodeId, updatedNode)
          }
          onDeleteNode={(nodeId) => handleDeleteNode("level2", nodeId)}
          selectedPath={selectedPath}
          nextLevelItems={level3Items}
          isLastLevel={lastVisibleLevel === 2}
        />
        <LevelColumn
          title="レベル3"
          subtitle={levelNames.level3}
          items={visibleLevel3Items}
          selectedId={selectedPath.level3}
          onNodeClick={(nodeId) => handleNodeSelection("level3", nodeId)}
          onEditNode={(nodeId, updatedNode) =>
            handleEditNode("level3", nodeId, updatedNode)
          }
          onDeleteNode={(nodeId) => handleDeleteNode("level3", nodeId)}
          selectedPath={selectedPath}
          nextLevelItems={level4Items}
          isLastLevel={lastVisibleLevel === 3}
        />
        {/* Always show level 4 if items exist, regardless of showLevel4 flag */}
        {visibleLevel4Items.length > 0 && (
          <LevelColumn
            title="レベル4"
            subtitle={levelNames.level4}
            items={visibleLevel4Items}
            selectedId={selectedPath.level4}
            onNodeClick={(nodeId) => handleNodeSelection("level4", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level4", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level4", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level5Items}
            isLastLevel={lastVisibleLevel === 4}
          />
        )}
        {/* Level 5 and beyond */}
        {visibleLevel5Items.length > 0 && (
          <LevelColumn
            title="レベル5"
            subtitle={levelNames.level5 || "手段2"}
            items={visibleLevel5Items}
            selectedId={selectedPath.level5}
            onNodeClick={(nodeId) => handleNodeSelection("level5", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level5", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level5", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level6Items}
            isLastLevel={lastVisibleLevel === 5}
          />
        )}
        {visibleLevel6Items.length > 0 && (
          <LevelColumn
            title="レベル6"
            subtitle={levelNames.level6 || "手段3"}
            items={visibleLevel6Items}
            selectedId={selectedPath.level6}
            onNodeClick={(nodeId) => handleNodeSelection("level6", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level6", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level6", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level7Items}
            isLastLevel={lastVisibleLevel === 6}
          />
        )}
        {visibleLevel7Items.length > 0 && (
          <LevelColumn
            title="レベル7"
            subtitle={levelNames.level7 || "手段4"}
            items={visibleLevel7Items}
            selectedId={selectedPath.level7}
            onNodeClick={(nodeId) => handleNodeSelection("level7", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level7", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level7", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level8Items}
            isLastLevel={lastVisibleLevel === 7}
          />
        )}
        {visibleLevel8Items.length > 0 && (
          <LevelColumn
            title="レベル8"
            subtitle={levelNames.level8 || "手段5"}
            items={visibleLevel8Items}
            selectedId={selectedPath.level8}
            onNodeClick={(nodeId) => handleNodeSelection("level8", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level8", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level8", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level9Items}
            isLastLevel={lastVisibleLevel === 8}
          />
        )}
        {visibleLevel9Items.length > 0 && (
          <LevelColumn
            title="レベル9"
            subtitle={levelNames.level9 || "手段6"}
            items={visibleLevel9Items}
            selectedId={selectedPath.level9}
            onNodeClick={(nodeId) => handleNodeSelection("level9", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level9", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level9", nodeId)}
            selectedPath={selectedPath}
            nextLevelItems={level10Items}
            isLastLevel={lastVisibleLevel === 9}
          />
        )}
        {visibleLevel10Items.length > 0 && (
          <LevelColumn
            title="レベル10"
            subtitle={levelNames.level10 || "手段7"}
            items={visibleLevel10Items}
            selectedId={selectedPath.level10}
            onNodeClick={(nodeId) => handleNodeSelection("level10", nodeId)}
            onEditNode={(nodeId, updatedNode) =>
              handleEditNode("level10", nodeId, updatedNode)
            }
            onDeleteNode={(nodeId) => handleDeleteNode("level10", nodeId)}
            selectedPath={selectedPath}
            isLastLevel={true}
          />
        )}
        <ConnectionLines
          level1to2Line={level1to2Line}
          level2to3Line={level2to3Line}
          level3to4Line={
            visibleLevel4Items.length > 0 ? level3to4Line : undefined
          }
          level4to5Line={
            visibleLevel5Items.length > 0 ? level4to5Line : undefined
          }
          level5to6Line={
            visibleLevel6Items.length > 0 ? level5to6Line : undefined
          }
          level6to7Line={
            visibleLevel7Items.length > 0 ? level6to7Line : undefined
          }
          level7to8Line={
            visibleLevel8Items.length > 0 ? level7to8Line : undefined
          }
          level8to9Line={
            visibleLevel9Items.length > 0 ? level8to9Line : undefined
          }
          level9to10Line={
            visibleLevel10Items.length > 0 ? level9to10Line : undefined
          }
        />
      </div>
    </div>
  );
};
