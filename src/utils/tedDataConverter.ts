
export const convertTedToTreeData = (tedResults: any) => {
  if (!tedResults) {
    console.log('No TED results provided to converter');
    return null;
  }

  console.log('Converting TED data:', tedResults);

  const level1Items: any[] = [];
  const level2Items: Record<string, any[]> = {};
  const level3Items: Record<string, any[]> = {};
  const level4Items: Record<string, any[]> = {};

  // Convert purpose layer (level 1)
  if (tedResults.purpose?.layer?.nodes) {
    tedResults.purpose.layer.nodes.forEach((node: any) => {
      level1Items.push({
        id: node.id,
        name: node.name,
        info: "18論文 • 4事例",
        description: node.description,
        level: 1
      });
    });
    console.log('Level 1 items converted:', level1Items.length);
  }

  // Convert function layer (level 2)
  if (tedResults.function?.layer?.nodes) {
    tedResults.function.layer.nodes.forEach((node: any) => {
      const parentId = node.parent_id;
      if (!level2Items[parentId]) {
        level2Items[parentId] = [];
      }
      level2Items[parentId].push({
        id: node.id,
        name: node.name,
        info: "18論文 • 4事例",
        description: node.description,
        level: 2
      });
    });
    console.log('Level 2 items converted:', Object.keys(level2Items).length, 'parents');
  }

  // Convert measure layer (level 3)
  if (tedResults.measure?.layer?.nodes) {
    tedResults.measure.layer.nodes.forEach((node: any) => {
      const parentId = node.parent_id;
      if (!level3Items[parentId]) {
        level3Items[parentId] = [];
      }
      level3Items[parentId].push({
        id: node.id,
        name: node.name,
        info: "18論文 • 4事例",
        description: node.description,
        level: 3
      });
    });
    console.log('Level 3 items converted:', Object.keys(level3Items).length, 'parents');
  }

  // Convert implementation layer (level 4)
  if (tedResults.implementation?.layer?.nodes) {
    tedResults.implementation.layer.nodes.forEach((node: any) => {
      const parentId = node.parent_id;
      if (!level4Items[parentId]) {
        level4Items[parentId] = [];
      }
      level4Items[parentId].push({
        id: node.id,
        name: node.name,
        info: "18論文 • 4事例", 
        description: node.description,
        level: 4
      });
    });
    console.log('Level 4 items converted:', Object.keys(level4Items).length, 'parents');
  }

  const result = {
    level1Items,
    level2Items,
    level3Items,
    level4Items
  };

  console.log('Final converted tree data summary:', {
    level1Count: level1Items.length,
    level2ParentCount: Object.keys(level2Items).length,
    level3ParentCount: Object.keys(level3Items).length,
    level4ParentCount: Object.keys(level4Items).length,
    totalLevel4Nodes: Object.values(level4Items).reduce((total, nodes) => total + nodes.length, 0)
  });

  return result;
};
