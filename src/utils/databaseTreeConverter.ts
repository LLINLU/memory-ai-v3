import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

interface TreeNodeFromDB {
  id: string;
  name: string;
  description: string | null;
  children_count: number; // Number of children, 0 indicates generation in progress
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

interface NodeEnrichmentData {
  paperCount: number;
  //useCaseCount: number;
}

// Helper function to fetch real paper and use case counts for nodes
const fetchNodeEnrichmentCounts = async (
  nodeIds: string[]
): Promise<Map<string, NodeEnrichmentData>> => {
  const enrichmentMap = new Map<string, NodeEnrichmentData>();

  if (nodeIds.length === 0) {
    return enrichmentMap;
  }

  // Get paper counts for all nodes
  const { data: paperData, error: paperError } = await supabase
    .from("node_papers" as any)
    .select("node_id")
    .in("node_id", nodeIds);

  if (paperError) {

    // Hardcode all nodes to have 20 papers for now
    nodeIds.forEach((nodeId) => {
      enrichmentMap.set(nodeId, {
        paperCount: 20,
        //useCaseCount: 0,
      });
    });
  } else {
    const paperCountMap = new Map<string, number>();

    // Count papers for each node
    paperData?.forEach((paper: any) => {
      const nodeId = paper.node_id;
      paperCountMap.set(nodeId, (paperCountMap.get(nodeId) || 0) + 1);
    });

    // Create enrichment data for all requested nodes
    nodeIds.forEach((nodeId) => {
      enrichmentMap.set(nodeId, {
        paperCount: paperCountMap.get(nodeId) || 0,
        //useCaseCount: useCaseCountMap.get(nodeId) || 0,
      });
    });
  }
  return enrichmentMap;
};

// Helper function to create info string with real or fallback data
const createNodeInfoString = (
  enrichmentData?: NodeEnrichmentData,
  nodeId?: string
): string => {
  if (enrichmentData && enrichmentData.paperCount > 0) {
    console.log(
      `[NODE INFO] Node ${nodeId} has ${enrichmentData.paperCount} papers`
    );
    return `${enrichmentData.paperCount}論文`;
  }
  // Show 0 papers if no enriched data is available
  console.log(
    `[NODE INFO] Node ${nodeId} showing 0 papers - enrichmentData:`,
    enrichmentData
  );
  return `0論文`;
};

const convertFastTreeToAppFormat = async (
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

  // Get enrichment data for all nodes
  const nodeIds = allNodes.map((node) => node.id);
  const enrichmentMap = await fetchNodeEnrichmentCounts(nodeIds);

  // For FAST trees: Root IS the Technology (level 0)
  // Level 1 items are How1 nodes - children of Technology root
  const level1Nodes = treeStructure.root.children || [];
  const level1Items = level1Nodes
    .filter((node) => node.axis === "How1")
    .map((node, index) => {
      const enrichmentData = enrichmentMap.get(node.id);
      return {
        id: node.id,
        name: node.name,
        info: createNodeInfoString(enrichmentData, node.id),
        description: node.description || "",
        color: `hsl(${200 + index * 30}, 70%, 50%)`,
        children_count: node.children_count,
      };
    }); // Extract level 2 items (How2 nodes - children of How1 nodes)
  const level2Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    if (how1Node.children && how1Node.children.length > 0) {
      const how2Nodes = how1Node.children.filter(
        (node) => node.axis === "How2"
      );
      if (how2Nodes.length > 0) {
        level2Items[how1Node.id] = how2Nodes.map((node, index) => {
          const enrichmentData = enrichmentMap.get(node.id);
          return {
            id: node.id,
            name: node.name,
            info: createNodeInfoString(enrichmentData, node.id),
            description: node.description || "",
            color: `hsl(${220 + index * 25}, 65%, 55%)`,
            children_count: node.children_count,
          };
        });
      }
    } else if (how1Node.children_count === 0) {
      // Show How1 nodes that are pending subtree generation
      level2Items[how1Node.id] = [];
    }
  }); // Extract level 3 items (How3 nodes - children of How2 nodes)
  const level3Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    how1Node.children?.forEach((how2Node) => {
      if (how2Node.axis === "How2") {
        if (how2Node.children && how2Node.children.length > 0) {
          const how3Nodes = how2Node.children.filter(
            (node) => node.axis === "How3"
          );
          if (how3Nodes.length > 0) {
            level3Items[how2Node.id] = how3Nodes.map((node, index) => {
              const enrichmentData = enrichmentMap.get(node.id);
              return {
                id: node.id,
                name: node.name,
                info: createNodeInfoString(enrichmentData, node.id),
                description: node.description || "",
                color: `hsl(${240 + index * 20}, 60%, 60%)`,
                children_count: node.children_count,
              };
            });
          }
        } else if (how2Node.children_count === 0) {
          // Show How2 nodes that are pending subtree generation
          level3Items[how2Node.id] = [];
        }
      }
    });
  }); // Extract level 4 items (How4 nodes - children of How3 nodes)
  const level4Items: Record<string, any[]> = {};
  level1Nodes.forEach((how1Node) => {
    how1Node.children?.forEach((how2Node) => {
      if (how2Node.axis === "How2") {
        how2Node.children?.forEach((how3Node) => {
          if (how3Node.axis === "How3") {
            if (how3Node.children && how3Node.children.length > 0) {
              const how4Nodes = how3Node.children.filter(
                (node) => node.axis === "How4"
              );
              if (how4Nodes.length > 0) {
                level4Items[how3Node.id] = how4Nodes.map((node, index) => {
                  const enrichmentData = enrichmentMap.get(node.id);
                  return {
                    id: node.id,
                    name: node.name,
                    info: createNodeInfoString(enrichmentData, node.id),
                    description: node.description || "",
                    color: `hsl(${260 + index * 15}, 55%, 65%)`,
                    children_count: node.children_count,
                  };
                });
              }
            } else if (how3Node.children_count === 0) {
              // Show How3 nodes that are pending subtree generation
              level4Items[how3Node.id] = [];
            }
          }
        });
      }
    });
  }); // Helper function to extract children with specific axis types for FAST
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
          items[parentNode.id] = childNodes.map((node, index) => {
            const enrichmentData = enrichmentMap.get(node.id);
            return {
              id: node.id,
              name: node.name,
              info: createNodeInfoString(enrichmentData, node.id),
              description: node.description || "",
              color: `hsl(${260 + index * 15}, 55%, 65%)`,
              children_count: node.children_count,
            };
          });
        }
      } else if (parentNode.children_count === 0) {
        // Show parent nodes that are pending subtree generation
        items[parentNode.id] = [];
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

export const convertDatabaseTreeToAppFormat = async (
  treeStructure: TreeStructureFromDB,
  treeMetadata?: {
    description?: string;
    search_theme?: string;
    name?: string;
    mode?: string;
  }
) => {
  console.log(
    `[CONVERTER DEBUG] Converting tree structure with mode: ${
      treeMetadata?.mode || "TED"
    }`
  );

  if (!treeStructure?.root) {
    console.error(
      "[CONVERTER DEBUG] Invalid tree structure received from database"
    );
    return null;
  }

  // Determine if this is a FAST tree based on metadata or axis types
  const isFastTree =
    treeMetadata?.mode === "FAST" ||
    (treeStructure.root.children &&
      treeStructure.root.children.some((child) => child.axis === "Technology"));

  console.log(
    `[CONVERTER DEBUG] Using ${isFastTree ? "FAST" : "TED"} mode conversion`
  );

  if (isFastTree) {
    return await convertFastTreeToAppFormat(treeStructure, treeMetadata);
  } else {
    return await convertTedTreeToAppFormat(treeStructure, treeMetadata);
  }
};

const convertTedTreeToAppFormat = async (
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

  // Get enrichment data for all nodes
  const nodeIds = allNodes.map((node) => node.id);
  const enrichmentMap = await fetchNodeEnrichmentCounts(nodeIds);

  // Extract level 1 items (Scenario nodes - children of root)
  const level1Nodes = treeStructure.root.children || [];

  console.log(
    `[CONVERTER DEBUG TED] Found ${level1Nodes.length} level 1 nodes`
  );
  console.log(
    `[CONVERTER DEBUG TED] Level 1 nodes:`,
    level1Nodes.map((node) => ({
      name: node.name,
      axis: node.axis,
      children_count: node.children_count,
      id: node.id,
    }))
  );

  const level1Items = level1Nodes
    .filter((node) => node.axis === "Scenario")
    .map((node, index) => {
      console.log(
        `[CONVERTER DEBUG TED] Converting scenario: ${node.name} with children_count: ${node.children_count}`
      );
      const enrichmentData = enrichmentMap.get(node.id);
      return {
        id: node.id,
        name: node.name,
        info: createNodeInfoString(enrichmentData, node.id),
        description: node.description || "",
        color: `hsl(${200 + index * 30}, 70%, 50%)`,
        children_count: node.children_count,
      };
    });

  console.log(
    `[CONVERTER DEBUG TED] Converted level1Items:`,
    level1Items.map((item) => ({
      name: item.name,
      children_count: item.children_count,
      id: item.id,
    }))
  );

  // Extract level 2 items (Purpose nodes - children of Scenario nodes)
  const level2Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    if (scenarioNode.children && scenarioNode.children.length > 0) {
      const purposeNodes = scenarioNode.children.filter(
        (node) => node.axis === "Purpose"
      );
      if (purposeNodes.length > 0) {
        level2Items[scenarioNode.id] = purposeNodes.map((node, index) => {
          const enrichmentData = enrichmentMap.get(node.id);
          return {
            id: node.id,
            name: node.name,
            info: createNodeInfoString(enrichmentData, node.id),
            description: node.description || "",
            color: `hsl(${220 + index * 25}, 65%, 55%)`,
            children_count: node.children_count,
          };
        });
      }
    } else if (scenarioNode.children_count === 0) {
      level2Items[scenarioNode.id] = [];
    }
  });

  // Extract level 3 items (Function nodes - children of Purpose nodes)
  const level3Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      if (purposeNode.axis === "Purpose") {
        if (purposeNode.children && purposeNode.children.length > 0) {
          const functionNodes = purposeNode.children.filter(
            (node) => node.axis === "Function"
          );
          if (functionNodes.length > 0) {
            level3Items[purposeNode.id] = functionNodes.map((node, index) => {
              const enrichmentData = enrichmentMap.get(node.id);
              return {
                id: node.id,
                name: node.name,
                info: createNodeInfoString(enrichmentData, node.id),
                description: node.description || "",
                color: `hsl(${240 + index * 20}, 60%, 60%)`,
                children_count: node.children_count,
              };
            });
          }
        } else if (purposeNode.children_count === 0) {
          level3Items[purposeNode.id] = [];
        }
      }
    });
  });

  // Extract level 4 items (Measure nodes - children of Function nodes)
  // Note: The database may have Measure nodes at multiple levels (4, 5, 6, etc.)
  // We'll collect all Measure nodes that are direct children of Function nodes
  const level4Items: Record<string, any[]> = {};
  level1Nodes.forEach((scenarioNode) => {
    scenarioNode.children?.forEach((purposeNode) => {
      if (purposeNode.axis === "Purpose") {
        purposeNode.children?.forEach((functionNode) => {
          if (functionNode.axis === "Function") {
            if (functionNode.children && functionNode.children.length > 0) {
              // Get all Measure nodes regardless of their database level
              const measureNodes = functionNode.children.filter(
                (node) => node.axis === "Measure"
              );
              if (measureNodes.length > 0) {
                level4Items[functionNode.id] = measureNodes.map(
                  (node, index) => {
                    const enrichmentData = enrichmentMap.get(node.id);
                    return {
                      id: node.id,
                      name: node.name,
                      info: createNodeInfoString(enrichmentData, node.id),
                      description: node.description || "",
                      color: `hsl(${260 + index * 15}, 55%, 65%)`,
                      children_count: node.children_count,
                    };
                  }
                );
              }
            } else if (functionNode.children_count === 0) {
              level4Items[functionNode.id] = [];
            }
          }
        });
      }
    });
  }); // Helper function to extract children with specific axis types
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
          items[parentNode.id] = childNodes.map((node, index) => {
            const enrichmentData = enrichmentMap.get(node.id);
            return {
              id: node.id,
              name: node.name,
              info: createNodeInfoString(enrichmentData, node.id),
              description: node.description || "",
              color: `hsl(${260 + index * 15}, 55%, 65%)`,
              children_count: node.children_count,
            };
          });
        }
      } else if (parentNode.children_count === 0) {
        // Show parent nodes that are pending subtree generation
        items[parentNode.id] = [];
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
