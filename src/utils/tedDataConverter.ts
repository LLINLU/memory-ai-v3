
export const convertTedToTreeData = (tedResults: any) => {
  if (!tedResults) return null;

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
    console.log('Level 1 items:', level1Items);
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
    console.log('Level 2 items:', level2Items);
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
    console.log('Level 3 items:', level3Items);
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
    console.log('Level 4 items:', level4Items);
  }

  const result = {
    level1Items,
    level2Items,
    level3Items,
    level4Items
  };

  console.log('Final converted tree data:', result);
  return result;
};
