import { useEffect, useState } from "react";
import { TreeNode } from "@/types/tree";

interface SelectedNodeInfo {
  title: string;
  description: string;
}

export const useNodeInfo = (
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
  },
  level1Items: TreeNode[],
  level2Items: Record<string, TreeNode[]>,
  level3Items: Record<string, TreeNode[]>,
  level4Items: Record<string, TreeNode[]>,
  level5Items?: Record<string, TreeNode[]>,
  level6Items?: Record<string, TreeNode[]>,
  level7Items?: Record<string, TreeNode[]>,
  level8Items?: Record<string, TreeNode[]>,
  level9Items?: Record<string, TreeNode[]>,
  level10Items?: Record<string, TreeNode[]>
) => {
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<SelectedNodeInfo>({
    title: "",
    description: "",
  });
  // Function to find the selected node's info
  const getSelectedNodeInfo = () => {
    if (!level1Items || !level2Items || !level3Items || !level4Items) {
      return { title: "", description: "" };
    }

    let title = "";
    let description = "";

    // Check from highest level to lowest (most specific first)
    if (selectedPath.level10 && level10Items) {
      const level10NodeItems = level10Items[selectedPath.level9 || ""] || [];
      const selectedNode = level10NodeItems.find(
        (item) => item.id === selectedPath.level10
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level9 && level9Items) {
      const level9NodeItems = level9Items[selectedPath.level8 || ""] || [];
      const selectedNode = level9NodeItems.find(
        (item) => item.id === selectedPath.level9
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level8 && level8Items) {
      const level8NodeItems = level8Items[selectedPath.level7 || ""] || [];
      const selectedNode = level8NodeItems.find(
        (item) => item.id === selectedPath.level8
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level7 && level7Items) {
      const level7NodeItems = level7Items[selectedPath.level6 || ""] || [];
      const selectedNode = level7NodeItems.find(
        (item) => item.id === selectedPath.level7
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level6 && level6Items) {
      const level6NodeItems = level6Items[selectedPath.level5 || ""] || [];
      const selectedNode = level6NodeItems.find(
        (item) => item.id === selectedPath.level6
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level5 && level5Items) {
      const level5NodeItems = level5Items[selectedPath.level4] || [];
      const selectedNode = level5NodeItems.find(
        (item) => item.id === selectedPath.level5
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    } else if (selectedPath.level4) {
      const level4NodeItems = level4Items[selectedPath.level3] || [];
      const selectedNode = level4NodeItems.find(
        (item) => item.id === selectedPath.level4
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Then check level 3
    else if (selectedPath.level3) {
      const level3NodeItems = level3Items[selectedPath.level2] || [];
      const selectedNode = level3NodeItems.find(
        (item) => item.id === selectedPath.level3
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Then check level 2
    else if (selectedPath.level2) {
      const level2NodeItems = level2Items[selectedPath.level1] || [];
      const selectedNode = level2NodeItems.find(
        (item) => item.id === selectedPath.level2
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Finally check level 1
    else if (selectedPath.level1) {
      const selectedNode = level1Items.find(
        (item) => item.id === selectedPath.level1
      );
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }

    return { title, description };
  };
  // Update selected node info when path changes or level items change
  useEffect(() => {
    if (level1Items && level2Items && level3Items && level4Items) {
      setSelectedNodeInfo(getSelectedNodeInfo());
    }
  }, [
    selectedPath,
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    level5Items,
    level6Items,
    level7Items,
    level8Items,
    level9Items,
    level10Items,
  ]);

  return selectedNodeInfo;
};
