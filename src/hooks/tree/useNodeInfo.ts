
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
  },
  level1Items: TreeNode[],
  level2Items: Record<string, TreeNode[]>,
  level3Items: Record<string, TreeNode[]>
) => {
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<SelectedNodeInfo>({
    title: "",
    description: ""
  });

  // Function to find the selected node's info
  const getSelectedNodeInfo = () => {
    if (!level1Items || !level2Items || !level3Items) {
      return { title: "", description: "" };
    }
    
    let title = "";
    let description = "";

    // Check level 3 first (most specific)
    if (selectedPath.level3) {
      const level3NodeItems = level3Items[selectedPath.level2] || [];
      const selectedNode = level3NodeItems.find(item => item.id === selectedPath.level3);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Then check level 2
    else if (selectedPath.level2) {
      const level2NodeItems = level2Items[selectedPath.level1] || [];
      const selectedNode = level2NodeItems.find(item => item.id === selectedPath.level2);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }
    // Finally check level 1
    else if (selectedPath.level1) {
      const selectedNode = level1Items.find(item => item.id === selectedPath.level1);
      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
      }
    }

    return { title, description };
  };

  // Update selected node info when path changes or level items change
  useEffect(() => {
    if (level1Items && level2Items && level3Items) {
      setSelectedNodeInfo(getSelectedNodeInfo());
    }
  }, [selectedPath, level1Items, level2Items, level3Items]);

  return selectedNodeInfo;
};
