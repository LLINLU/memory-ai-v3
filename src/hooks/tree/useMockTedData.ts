
import { forestManagementData, medicalData, agricultureData } from './mockData';

export const getMockTedData = (query: string) => {
  // Default to forest management mock data
  let mockData = forestManagementData;

  // Customize based on query keywords
  if (query.includes('医療') || query.includes('診断')) {
    mockData = medicalData;
  } else if (query.includes('農業') || query.includes('栽培')) {
    mockData = agricultureData;
  }

  return mockData;
};
