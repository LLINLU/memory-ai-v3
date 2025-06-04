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
  treeStructure: TreeStructureFromDB,
  treeMetadata?: { description?: string; search_theme?: string; name?: string }
) => {
  console.log(
    "Converting database tree structure to app format:",
    treeStructure,
    "with metadata:",
    treeMetadata
  );

  if (!treeStructure?.root) {
    console.error("Invalid tree structure received from database");
    return null;
  }

  // Helper function to recursively collect all nodes
  const collectAllNodes = (node: TreeNodeFromDB, allNodes: TreeNodeFromDB[] = []): TreeNodeFromDB[] => {
    allNodes.push(node);
    if (node.children) {
      node.children.forEach(child => collectAllNodes(child, allNodes));
    }
    return allNodes;
  };

  const allNodes = collectAllNodes(treeStructure.root);
  console.log("All nodes collected:", allNodes.length);
  console.log("Node breakdown by level:", 
    allNodes.reduce((acc, node) => {
      acc[node.level] = (acc[node.level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  );
  console.log("Node breakdown by axis:", 
    allNodes.reduce((acc, node) => {
      acc[node.axis] = (acc[node.axis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );
  // Extract level 1 items (Scenario nodes - children of root)
  const level1Nodes = treeStructure.root.children || [];
  console.log("Level 1 nodes found:", level1Nodes.length);
  
  const level1Items = level1Nodes
    .filter(node => node.axis === "Scenario")
    .map((node, index) => {
      console.log("Processing Level 1 Scenario node:", node.name, "ID:", node.id);
      return {
        id: node.id,
        name: node.name,
        info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
          Math.floor(Math.random() * 20) + 1
        }事例`,
        description: node.description || "",
        color: `hsl(${200 + index * 30}, 70%, 50%)`,
      };
    });

  console.log("Level 1 items created:", level1Items.length);
  // Extract level 2 items (Purpose nodes - children of Scenario nodes)
  const level2Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    console.log(`Processing Scenario node ${scenarioNode.name} (${scenarioNode.id}) for Level 2`);
    if (scenarioNode.children && scenarioNode.children.length > 0) {
      console.log(`  Found ${scenarioNode.children.length} children`);
      const purposeNodes = scenarioNode.children.filter(node => node.axis === "Purpose");
      console.log(`  Found ${purposeNodes.length} Purpose nodes`);
      if (purposeNodes.length > 0) {
        level2Items[scenarioNode.id] = purposeNodes.map((node, index) => {
          console.log(`    Creating Level 2 item: ${node.name} (${node.id})`);
          return {
            id: node.id,
            name: node.name,
            info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
              Math.floor(Math.random() * 20) + 1
            }事例`,
            description: node.description || "",
            color: `hsl(${220 + index * 25}, 65%, 55%)`,
          };
        });
      }
    }
  });
  
  console.log("Level 2 items created:", Object.keys(level2Items).length, "scenario groups");
  // Extract level 3 items (Function nodes - children of Purpose nodes)
  const level3Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      console.log(`Processing Purpose node ${purposeNode.name} (${purposeNode.id}) for Level 3`);
      if (purposeNode.axis === "Purpose" && purposeNode.children && purposeNode.children.length > 0) {
        console.log(`  Found ${purposeNode.children.length} children`);
        const functionNodes = purposeNode.children.filter(node => node.axis === "Function");
        console.log(`  Found ${functionNodes.length} Function nodes`);
        if (functionNodes.length > 0) {
          level3Items[purposeNode.id] = functionNodes.map((node, index) => {
            console.log(`    Creating Level 3 item: ${node.name} (${node.id})`);
            return {
              id: node.id,
              name: node.name,
              info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
                Math.floor(Math.random() * 20) + 1
              }事例`,
              description: node.description || "",
              color: `hsl(${240 + index * 20}, 60%, 60%)`,
            };
          });
        }
      }
    });
  });
  
  console.log("Level 3 items created:", Object.keys(level3Items).length, "purpose groups");
  // Extract level 4 items (Measure nodes - children of Function nodes)
  // Note: The database may have Measure nodes at multiple levels (4, 5, 6, etc.)
  // We'll collect all Measure nodes that are direct children of Function nodes
  const level4Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      if (purposeNode.axis === "Purpose") {
        purposeNode.children?.forEach((functionNode) => {
          console.log(`Processing Function node ${functionNode.name} (${functionNode.id}) for Level 4`);
          if (functionNode.axis === "Function" && functionNode.children && functionNode.children.length > 0) {
            console.log(`  Found ${functionNode.children.length} children`);
            // Get all Measure nodes regardless of their database level
            const measureNodes = functionNode.children.filter(node => node.axis === "Measure");
            console.log(`  Found ${measureNodes.length} Measure nodes`);
            if (measureNodes.length > 0) {
              level4Items[functionNode.id] = measureNodes.map((node, index) => {
                console.log(`    Creating Level 4 item: ${node.name} (${node.id})`);
                return {
                  id: node.id,
                  name: node.name,
                  info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
                    Math.floor(Math.random() * 20) + 1
                  }事例`,
                  description: node.description || "",
                  color: `hsl(${260 + index * 15}, 55%, 65%)`,
                };
              });
            }
          }
        });
      }
    });
  });
  
  console.log("Level 4 items created:", Object.keys(level4Items).length, "function groups");
  console.log("Level 4 total items:", 
    Object.values(level4Items).reduce((total, items) => total + items.length, 0)
  );
  const convertedData = {
    level1Items,
    level2Items,
    level3Items,
    level4Items,
    scenario: treeMetadata?.description || "",
    searchTheme: treeMetadata?.search_theme || "",
    treeName: treeMetadata?.name || "",
  };

  console.log("Converted database tree to app format:", convertedData);
  return convertedData;
};
