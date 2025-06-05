import type { Json } from "@/integrations/supabase/types";

interface TreeNodeFromDB {
  id: string;
  name: string;
  description: string | null;
  axis:
    | "Scenario"
    | "Purpose"
    | "Function"
    | "Measure"
    | "Measure2"
    | "Measure3"
    | "Measure4"
    | "Measure5"
    | "Measure6"
    | "Measure7"
    | "Technology"
    | "How1"
    | "How2"
    | "How3"
    | "How4"
    | "How5"
    | "How6"
    | "How7";
  level: number;
  children?: TreeNodeFromDB[];
}

interface TreeStructureFromDB {
  root: TreeNodeFromDB;
  reasoning: string;
  layer_config: Json;
  scenario_inputs: Json;
}

const convertFastTreeToAppFormat = (
  treeStructure: TreeStructureFromDB,
  treeMetadata?: { description?: string; search_theme?: string; name?: string }
) => {
  // Helper function to recursively collect all nodes
  const collectAllNodes = (
    node: TreeNodeFromDB,
    allNodes: TreeNodeFromDB[] = []
  ): TreeNodeFromDB[] => {
    allNodes.push(node);
    if (node.children) {
      node.children.forEach((child) => collectAllNodes(child, allNodes));
    }
    return allNodes;
  };
  const allNodes = collectAllNodes(treeStructure.root);

  // For FAST trees: Root IS the Technology (level 0)
  // Level 1 items are How1 nodes - children of Technology root
  const level1Nodes = treeStructure.root.children || [];

  const level1Items = level1Nodes
    .filter((node) => node.axis === "How1")
    .map((node, index) => {
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
  // Extract level 2 items (How2 nodes - children of How1 nodes)
  const level2Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    if (how1Node.children && how1Node.children.length > 0) {
      const how2Nodes = how1Node.children.filter(
        (node) => node.axis === "How2"
      );
      if (how2Nodes.length > 0) {
        level2Items[how1Node.id] = how2Nodes.map((node, index) => {
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
  // Extract level 3 items (How3 nodes - children of How2 nodes)
  const level3Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    how1Node.children?.forEach((how2Node) => {
      if (
        how2Node.axis === "How2" &&
        how2Node.children &&
        how2Node.children.length > 0
      ) {
        const how3Nodes = how2Node.children.filter(
          (node) => node.axis === "How3"
        );
        if (how3Nodes.length > 0) {
          level3Items[how2Node.id] = how3Nodes.map((node, index) => {
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
  // Extract level 4 items (How4 nodes - children of How3 nodes)
  const level4Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    how1Node.children?.forEach((how2Node) => {
      if (how2Node.axis === "How2") {
        how2Node.children?.forEach((how3Node) => {
          if (
            how3Node.axis === "How3" &&
            how3Node.children &&
            how3Node.children.length > 0
          ) {
            const how4Nodes = how3Node.children.filter(
              (node) => node.axis === "How4"
            );
            if (how4Nodes.length > 0) {
              level4Items[how3Node.id] = how4Nodes.map((node, index) => {
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

  // Helper function to extract children with specific axis types for FAST
  const extractFastChildrenByAxis = (
    parentNodes: TreeNodeFromDB[],
    axisType: string
  ): Record<string, any[]> => {
    const items: Record<string, any[]> = {};

    parentNodes.forEach((parentNode) => {
      if (parentNode.children && parentNode.children.length > 0) {
        const childNodes = parentNode.children.filter(
          (node) => node.axis === axisType
        );
        if (childNodes.length > 0) {
          items[parentNode.id] = childNodes.map((node, index) => ({
            id: node.id,
            name: node.name,
            info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
              Math.floor(Math.random() * 20) + 1
            }事例`,
            description: node.description || "",
            color: `hsl(${260 + index * 15}, 55%, 65%)`,
          }));
        }
      }
    });

    return items;
  };
  // Extract level 5+ items (How5, How6, etc.)
  const level4Nodes: TreeNodeFromDB[] = [];
  Object.values(level4Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level4Nodes.push(dbNode);
    });
  });
  const level5Items = extractFastChildrenByAxis(level4Nodes, "How5");

  const level5Nodes: TreeNodeFromDB[] = [];
  Object.values(level5Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level5Nodes.push(dbNode);
    });
  });
  const level6Items = extractFastChildrenByAxis(level5Nodes, "How6");

  const level6Nodes: TreeNodeFromDB[] = [];
  Object.values(level6Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level6Nodes.push(dbNode);
    });
  });
  const level7Items = extractFastChildrenByAxis(level6Nodes, "How7");

  // For FAST trees, we stop at How7 (level 7) as per database schema
  const level8Items: Record<string, any[]> = {};
  const level9Items: Record<string, any[]> = {};
  const level10Items: Record<string, any[]> = {};

  const convertedData = {
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
    scenario: treeMetadata?.description || "",
    searchTheme: treeMetadata?.search_theme || "",
    treeName: treeMetadata?.name || "",
    mode: "FAST",
  };

  return convertedData;
};

export const convertDatabaseTreeToAppFormat = (
  treeStructure: TreeStructureFromDB,
  treeMetadata?: {
    description?: string;
    search_theme?: string;
    name?: string;
    mode?: string;
  }
) => {
  if (!treeStructure?.root) {
    //console.error("Invalid tree structure received from database");
    return null;
  }

  // Determine if this is a FAST tree based on metadata or axis types
  const isFastTree =
    treeMetadata?.mode === "FAST" ||
    (treeStructure.root.children &&
      treeStructure.root.children.some((child) => child.axis === "Technology"));

  if (isFastTree) {
    return convertFastTreeToAppFormat(treeStructure, treeMetadata);
  } else {
    return convertTedTreeToAppFormat(treeStructure, treeMetadata);
  }
};

const convertTedTreeToAppFormat = (
  treeStructure: TreeStructureFromDB,
  treeMetadata?: { description?: string; search_theme?: string; name?: string }
) => {
  // Helper function to recursively collect all nodes
  const collectAllNodes = (
    node: TreeNodeFromDB,
    allNodes: TreeNodeFromDB[] = []
  ): TreeNodeFromDB[] => {
    allNodes.push(node);
    if (node.children) {
      node.children.forEach((child) => collectAllNodes(child, allNodes));
    }
    return allNodes;
  };

  const allNodes = collectAllNodes(treeStructure.root);

  // Extract level 1 items (Scenario nodes - children of root)
  const level1Nodes = treeStructure.root.children || [];

  const level1Items = level1Nodes
    .filter((node) => node.axis === "Scenario")
    .map((node, index) => {
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

  // Extract level 2 items (Purpose nodes - children of Scenario nodes)
  const level2Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    //console.log(`Processing Scenario node ${scenarioNode.name} (${scenarioNode.id}) for Level 2`);
    if (scenarioNode.children && scenarioNode.children.length > 0) {
      //console.log(`  Found ${scenarioNode.children.length} children`);
      const purposeNodes = scenarioNode.children.filter(
        (node) => node.axis === "Purpose"
      );
      //console.log(`  Found ${purposeNodes.length} Purpose nodes`);
      if (purposeNodes.length > 0) {
        level2Items[scenarioNode.id] = purposeNodes.map((node, index) => {
          //console.log(`    Creating Level 2 item: ${node.name} (${node.id})`);
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

  //console.log("Level 2 items created:", Object.keys(level2Items).length, "scenario groups");
  // Extract level 3 items (Function nodes - children of Purpose nodes)
  const level3Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      //console.log(`Processing Purpose node ${purposeNode.name} (${purposeNode.id}) for Level 3`);
      if (
        purposeNode.axis === "Purpose" &&
        purposeNode.children &&
        purposeNode.children.length > 0
      ) {
        //console.log(`  Found ${purposeNode.children.length} children`);
        const functionNodes = purposeNode.children.filter(
          (node) => node.axis === "Function"
        );
        //console.log(`  Found ${functionNodes.length} Function nodes`);
        if (functionNodes.length > 0) {
          level3Items[purposeNode.id] = functionNodes.map((node, index) => {
            //console.log(`    Creating Level 3 item: ${node.name} (${node.id})`);
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

  //console.log("Level 3 items created:", Object.keys(level3Items).length, "purpose groups");
  // Extract level 4 items (Measure nodes - children of Function nodes)
  // Note: The database may have Measure nodes at multiple levels (4, 5, 6, etc.)
  // We'll collect all Measure nodes that are direct children of Function nodes
  const level4Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      if (purposeNode.axis === "Purpose") {
        purposeNode.children?.forEach((functionNode) => {
          //console.log(`Processing Function node ${functionNode.name} (${functionNode.id}) for Level 4`);
          if (
            functionNode.axis === "Function" &&
            functionNode.children &&
            functionNode.children.length > 0
          ) {
            //console.log(`  Found ${functionNode.children.length} children`);
            // Get all Measure nodes regardless of their database level
            const measureNodes = functionNode.children.filter(
              (node) => node.axis === "Measure"
            );
            //console.log(`  Found ${measureNodes.length} Measure nodes`);
            if (measureNodes.length > 0) {
              level4Items[functionNode.id] = measureNodes.map((node, index) => {
                //console.log(`    Creating Level 4 item: ${node.name} (${node.id})`);
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

  // Helper function to extract children with specific axis types
  const extractChildrenByAxis = (
    parentNodes: TreeNodeFromDB[],
    axisType: string
  ): Record<string, any[]> => {
    const items: Record<string, any[]> = {};

    parentNodes.forEach((parentNode) => {
      if (parentNode.children && parentNode.children.length > 0) {
        const childNodes = parentNode.children.filter(
          (node) => node.axis === axisType
        );
        if (childNodes.length > 0) {
          items[parentNode.id] = childNodes.map((node, index) => ({
            id: node.id,
            name: node.name,
            info: `${Math.floor(Math.random() * 50) + 1}論文 • ${
              Math.floor(Math.random() * 20) + 1
            }事例`,
            description: node.description || "",
            color: `hsl(${260 + index * 15}, 55%, 65%)`,
          }));
        }
      }
    });

    return items;
  };

  // Extract level 5 items (Measure2 nodes - children of Measure nodes)
  const level4Nodes: TreeNodeFromDB[] = [];
  Object.values(level4Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level4Nodes.push(dbNode);
    });
  });
  const level5Items = extractChildrenByAxis(level4Nodes, "Measure2");

  // Extract level 6 items (Measure3 nodes - children of Measure2 nodes)
  const level5Nodes: TreeNodeFromDB[] = [];
  Object.values(level5Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level5Nodes.push(dbNode);
    });
  });
  const level6Items = extractChildrenByAxis(level5Nodes, "Measure3");

  // Extract level 7 items (Measure4 nodes - children of Measure3 nodes)
  const level6Nodes: TreeNodeFromDB[] = [];
  Object.values(level6Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level6Nodes.push(dbNode);
    });
  });
  const level7Items = extractChildrenByAxis(level6Nodes, "Measure4");

  // Extract level 8 items (Measure5 nodes - children of Measure4 nodes)
  const level7Nodes: TreeNodeFromDB[] = [];
  Object.values(level7Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level7Nodes.push(dbNode);
    });
  });
  const level8Items = extractChildrenByAxis(level7Nodes, "Measure5");

  // Extract level 9 items (Measure6 nodes - children of Measure5 nodes)
  const level8Nodes: TreeNodeFromDB[] = [];
  Object.values(level8Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level8Nodes.push(dbNode);
    });
  });
  const level9Items = extractChildrenByAxis(level8Nodes, "Measure6");

  // Extract level 10 items (Measure7 nodes - children of Measure6 nodes)
  const level9Nodes: TreeNodeFromDB[] = [];
  Object.values(level9Items).forEach((items) => {
    items.forEach((item) => {
      const dbNode = allNodes.find((node) => node.id === item.id);
      if (dbNode) level9Nodes.push(dbNode);
    });
  });
  const level10Items = extractChildrenByAxis(level9Nodes, "Measure7");
  const convertedData = {
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
    scenario: treeMetadata?.description || "",
    searchTheme: treeMetadata?.search_theme || "",
    treeName: treeMetadata?.name || "",
    mode: "TED",
  };

  //console.log("Converted database tree to app format:", convertedData);
  return convertedData;
};
