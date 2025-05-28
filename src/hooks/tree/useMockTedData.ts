
import { forestManagementData, medicalData, agricultureData } from './mockData';

export const getMockTedData = (query: string) => {
  // Default to forest management mock data
  let mockData = forestManagementData;

  console.log('getMockTedData called with query:', query);
  console.log('Selected mockData:', mockData);

  // Customize based on query keywords
  if (query.includes('医療') || query.includes('診断')) {
    mockData = medicalData;
  } else if (query.includes('農業') || query.includes('栽培')) {
    mockData = agricultureData;
  }

  console.log('Final mockData structure:', {
    purpose: mockData.purpose,
    function: mockData.function,
    measure: mockData.measure,
    implementation: mockData.implementation
  });

  return mockData;
};
