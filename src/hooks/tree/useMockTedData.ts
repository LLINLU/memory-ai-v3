
import React from 'react';
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

  // Ensure we always return valid data
  if (!convertedTreeData || !convertedTreeData.level1Items || convertedTreeData.level1Items.length === 0) {
    console.error('Failed to convert mock data properly, using fallback');
    // Return a minimal fallback structure
    return {
      tedResults: mockData,
      treeData: {
        level1Items: [{
          id: 'fallback-level1',
          name: 'データ読み込みエラー',
          description: 'データの読み込みに失敗しました',
          level: 1
        }],
        level2Items: {},
        level3Items: {},
        level4Items: {}
      }
    };
  }

  return {
    tedResults: mockData,
    treeData: convertedTreeData
  };
};
