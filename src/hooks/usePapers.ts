
import { useQuery } from "@tanstack/react-query";
import { defaultPapers, updatedPapers, Paper } from "@/data/paperData";

const fetchPapers = async (paperSet: 'default' | 'updated'): Promise<Paper[]> => {
  // Simulate API call with a small delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return paperSet === 'default' ? defaultPapers : updatedPapers;
};

export const usePapers = (paperSet: 'default' | 'updated') => {
  return useQuery({
    queryKey: ['papers', paperSet],
    queryFn: () => fetchPapers(paperSet),
  });
};
