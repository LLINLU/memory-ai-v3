import { useEffect, useState } from "react";
import { TreeNode } from "@/types/tree";

interface SelectedNodeInfo {
  title: string;
  description: string;
  nodeId: string;
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
  userClickedNode: {
    level: import("@/types/tree").PathLevel;
    nodeId: string;
  } | null,
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
    nodeId: "",
  }); // Function to find the selected node's info
  const getSelectedNodeInfo = () => {
    if (!level1Items || !level2Items || !level3Items || !level4Items) {
      return { title: "", description: "", nodeId: "" };
    }

    //console.log("useNodeInfo: selectedPath =", selectedPath);
    //console.log("useNodeInfo: userClickedNode =", userClickedNode);
    let title = "";
    let description = "";
    let nodeId = ""; // If we have a user clicked node, use that instead of the deepest auto-selected node
    if (userClickedNode) {
      const targetLevel = parseInt(userClickedNode.level.replace("level", ""));
      const targetId = userClickedNode.nodeId;

      // Find the node info for the user-clicked level
      let selectedNode: TreeNode | undefined;
      let parentId = "";

      // Get the parent ID based on the target level
      if (targetLevel === 2) {
        parentId = selectedPath.level1;
      } else if (targetLevel === 3) {
        parentId = selectedPath.level2;
      } else if (targetLevel === 4) {
        parentId = selectedPath.level3;
      } else if (targetLevel === 5) {
        parentId = selectedPath.level4 || "";
      } else if (targetLevel === 6) {
        parentId = selectedPath.level5 || "";
      } else if (targetLevel === 7) {
        parentId = selectedPath.level6 || "";
      } else if (targetLevel === 8) {
        parentId = selectedPath.level7 || "";
      } else if (targetLevel === 9) {
        parentId = selectedPath.level8 || "";
      } else if (targetLevel === 10) {
        parentId = selectedPath.level9 || "";
      }

      // Find the node based on the target level
      if (targetLevel === 1) {
        selectedNode = level1Items.find((item) => item.id === targetId);
      } else if (targetLevel === 2) {
        const level2NodeItems = level2Items[parentId] || [];
        selectedNode = level2NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 3) {
        const level3NodeItems = level3Items[parentId] || [];
        selectedNode = level3NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 4) {
        const level4NodeItems = level4Items[parentId] || [];
        selectedNode = level4NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 5 && level5Items) {
        const level5NodeItems = level5Items[parentId] || [];
        selectedNode = level5NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 6 && level6Items) {
        const level6NodeItems = level6Items[parentId] || [];
        selectedNode = level6NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 7 && level7Items) {
        const level7NodeItems = level7Items[parentId] || [];
        selectedNode = level7NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 8 && level8Items) {
        const level8NodeItems = level8Items[parentId] || [];
        selectedNode = level8NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 9 && level9Items) {
        const level9NodeItems = level9Items[parentId] || [];
        selectedNode = level9NodeItems.find((item) => item.id === targetId);
      } else if (targetLevel === 10 && level10Items) {
        const level10NodeItems = level10Items[parentId] || [];
        selectedNode = level10NodeItems.find((item) => item.id === targetId);
      }

      if (selectedNode) {
        title = selectedNode.name;
        description = selectedNode.description || "";
        nodeId = targetId;
        // console.log(
        //   `useNodeInfo: Found user-clicked node - level: ${targetLevel}, title: ${title}, description: ${description}, nodeId: ${nodeId}`
        // );
        return { title, description, nodeId };
      }
    }

    // Fall back to the original logic if no userClickedNode or node not found
    // Find the highest level that has a selection (last selected level)
    let targetLevel = 1;
    let targetId = selectedPath.level1;
    let parentId = "";

    if (selectedPath.level10 && level10Items) {
      targetLevel = 10;
      targetId = selectedPath.level10;
      parentId = selectedPath.level9 || "";
    } else if (selectedPath.level9 && level9Items) {
      targetLevel = 9;
      targetId = selectedPath.level9;
      parentId = selectedPath.level8 || "";
    } else if (selectedPath.level8 && level8Items) {
      targetLevel = 8;
      targetId = selectedPath.level8;
      parentId = selectedPath.level7 || "";
    } else if (selectedPath.level7 && level7Items) {
      targetLevel = 7;
      targetId = selectedPath.level7;
      parentId = selectedPath.level6 || "";
    } else if (selectedPath.level6 && level6Items) {
      targetLevel = 6;
      targetId = selectedPath.level6;
      parentId = selectedPath.level5 || "";
    } else if (selectedPath.level5 && level5Items) {
      targetLevel = 5;
      targetId = selectedPath.level5;
      parentId = selectedPath.level4 || "";
    } else if (selectedPath.level4) {
      targetLevel = 4;
      targetId = selectedPath.level4;
      parentId = selectedPath.level3;
    } else if (selectedPath.level3) {
      targetLevel = 3;
      targetId = selectedPath.level3;
      parentId = selectedPath.level2;
    } else if (selectedPath.level2) {
      targetLevel = 2;
      targetId = selectedPath.level2;
      parentId = selectedPath.level1;
    }

    // Now find the node info for the target level
    let selectedNode: TreeNode | undefined;

    if (targetLevel === 1) {
      selectedNode = level1Items.find((item) => item.id === targetId);
    } else if (targetLevel === 2) {
      const level2NodeItems = level2Items[parentId] || [];
      selectedNode = level2NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 3) {
      const level3NodeItems = level3Items[parentId] || [];
      selectedNode = level3NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 4) {
      const level4NodeItems = level4Items[parentId] || [];
      selectedNode = level4NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 5 && level5Items) {
      const level5NodeItems = level5Items[parentId] || [];
      selectedNode = level5NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 6 && level6Items) {
      const level6NodeItems = level6Items[parentId] || [];
      selectedNode = level6NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 7 && level7Items) {
      const level7NodeItems = level7Items[parentId] || [];
      selectedNode = level7NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 8 && level8Items) {
      const level8NodeItems = level8Items[parentId] || [];
      selectedNode = level8NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 9 && level9Items) {
      const level9NodeItems = level9Items[parentId] || [];
      selectedNode = level9NodeItems.find((item) => item.id === targetId);
    } else if (targetLevel === 10 && level10Items) {
      const level10NodeItems = level10Items[parentId] || [];
      selectedNode = level10NodeItems.find((item) => item.id === targetId);
    }
    if (selectedNode) {
      title = selectedNode.name;
      description = selectedNode.description || "";
      nodeId = targetId;
      // console.log(
      //   `useNodeInfo: Found node - title: ${title}, description: ${description}, nodeId: ${nodeId}`
      // );
    } else {
      //console.log("useNodeInfo: No node found for the target level and ID");
    }

    return { title, description, nodeId };
  };
  // Update selected node info when path changes or level items change
  useEffect(() => {
    if (level1Items && level2Items && level3Items && level4Items) {
      const nodeInfo = getSelectedNodeInfo();
      setSelectedNodeInfo(nodeInfo);
      //console.log("useNodeInfo: Updated selectedNodeInfo =", nodeInfo);
    }
  }, [
    selectedPath,
    userClickedNode,
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
