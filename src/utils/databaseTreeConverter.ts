import type { Json } from "@/integrations/supabase/types";

interface TreeNodeFromDB {
  id: string;
  name: string;
  description: string | null;
  axis: "Scenario" | "Purpose" | "Function" | "Measure";
  level: number;
  children?: TreeNodeFromDB[];
}

interface TreeStructureFromDB {
  root: TreeNodeFromDB;
  reasoning: string;
  layer_config: Json;
  scenario_inputs: Json;
}

export const convertDatabaseTreeToAppFormat = (
  treeStructure: TreeStructureFromDB
) => {
  console.log(
    "Converting database tree structure to app format:",
    treeStructure
  );

  if (!treeStructure?.root) {
    console.error("Invalid tree structure received from database");
    return null;
  }

  // Extract level 1 items (children of root)
  const level1Items =
    treeStructure.root.children?.map((node, index) => ({
      id: node.id,
      name: node.name,
      info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
        Math.floor(Math.random() * 20) + 1
      }事例`,
      description: node.description || "",
      color: `hsl(${200 + index * 30}, 70%, 50%)`,
    })) || [];

  // Extract level 2 items
  const level2Items: Record<string, any[]> = {};
  treeStructure.root.children?.forEach((level1Node) => {
    if (level1Node.children && level1Node.children.length > 0) {
      level2Items[level1Node.id] = level1Node.children.map((node, index) => ({
        id: node.id,
        name: node.name,
        info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
          Math.floor(Math.random() * 20) + 1
        }事例`,
        description: node.description || "",
        color: `hsl(${220 + index * 25}, 65%, 55%)`,
      }));
    }
  });

  // Extract level 3 items
  const level3Items: Record<string, any[]> = {};
  treeStructure.root.children?.forEach((level1Node) => {
    level1Node.children?.forEach((level2Node) => {
      if (level2Node.children && level2Node.children.length > 0) {
        level3Items[level2Node.id] = level2Node.children.map((node, index) => ({
          id: node.id,
          name: node.name,
          info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
            Math.floor(Math.random() * 20) + 1
          }事例`,
          description: node.description || "",
          color: `hsl(${240 + index * 20}, 60%, 60%)`,
        }));
      }
    });
  });

  const convertedData = {
    level1Items,
    level2Items,
    level3Items,
  };

  console.log("Converted database tree to app format:", convertedData);
  return convertedData;
};
