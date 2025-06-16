import React from "react";
import { ImplementationCard } from "./ImplementationCard";
import { useEnrichedData } from "@/hooks/useEnrichedData";

interface ImplementationListProps {
  selectedNodeId?: string;
}

export const ImplementationList = ({
  selectedNodeId,
}: ImplementationListProps) => {
  const { useCases, loading } = useEnrichedData(selectedNodeId || null);

  // Show loading state when fetching real data
  if (selectedNodeId && loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  // Use real data if available and a node is selected
  if (selectedNodeId && useCases.length > 0) {
    return (
      <div className="space-y-4">
        {useCases.map((useCase) => (
          <ImplementationCard
            key={useCase.id}
            title={useCase.title}
            description={useCase.description}
            releases={useCase.releases}
            badgeColor="bg-[#E8F1FF]"
            badgeTextColor="text-[#0EA5E9]"
            pressReleases={useCase.pressReleases}
          />
        ))}
      </div>
    );
  }

  // Show empty state when no node is selected
  if (!selectedNodeId) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">ノードを選択して実装事例を表示</p>
      </div>
    );
  }

  // Show empty state when node is selected but no data is available
  return (
    <div className="flex items-center justify-center py-8">
      <p className="text-gray-500 text-sm">
        この技術の実装事例はまだありません
      </p>
    </div>
  );
};
