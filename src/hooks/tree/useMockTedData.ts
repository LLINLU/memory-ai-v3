
import { forestManagementData, medicalData, agricultureData, unmeasuredForestData, forestryWorkerData } from './mockData';
import { convertTedToTreeData } from '@/utils/tedDataConverter';

export const getMockTedData = (query: string) => {
  // Default to forest management mock data
  let mockData = forestManagementData;

  console.log('getMockTedData called with query:', query);

  // Customize based on query keywords
  if (query.includes('医療') || query.includes('診断')) {
    mockData = medicalData;
  } else if (query.includes('農業') || query.includes('栽培')) {
    mockData = agricultureData;
  } else if (query.includes('未測量') || query.includes('測量されていない')) {
    mockData = unmeasuredForestData;
  } else if (query.includes('林業従事者') || query.includes('現場測量')) {
    mockData = forestryWorkerData;
  }

  console.log('Selected mockData:', mockData);
  console.log('Mock data structure check:', {
    purpose: mockData.purpose?.layer?.nodes?.length || 0,
    function: mockData.function?.layer?.nodes?.length || 0,
    measure: mockData.measure?.layer?.nodes?.length || 0,
    implementation: mockData.implementation?.layer?.nodes?.length || 0
  });

  // Convert the mock data to tree format using the same converter
  const convertedTreeData = convertTedToTreeData(mockData);
  console.log('Converted tree data from mock:', convertedTreeData);

  return {
    tedResults: mockData,
    treeData: convertedTreeData
  };
};
