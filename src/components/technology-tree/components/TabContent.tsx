import React, { useState } from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { FilterSort } from "../FilterSort";
import { TabNavigator } from "./TabNavigator";
import { Separator } from "@/components/ui/separator";
import { useEnrichedData } from "@/hooks/useEnrichedData";

interface TabContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  selectedNodeId?: string;
}

export const TabContent = ({
  activeTab,
  onValueChange,
  selectedNodeId,
}: TabContentProps) => {
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentSort, setCurrentSort] = useState("");
  // Get real enrichment data for the selected node
  const { papers, useCases } = useEnrichedData(selectedNodeId || null);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <TabNavigator
          onValueChange={onValueChange}
          papersCount={papers.length}
          useCasesCount={useCases.length}
        />
        <FilterSort
          className="justify-end"
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>
      {/* 🚫 TEMPORARILY DISABLED - Use Cases Tab not production ready */}
      {/* Only show papers for now */}
      <PaperList
        selectedNodeId={selectedNodeId}
        filterString={currentFilter}
        sortBy={currentSort}
      />
      {/* 
      {activeTab === "papers" ? (
        <PaperList
          selectedNodeId={selectedNodeId}
          filterString={currentFilter}
          sortBy={currentSort}
        />
      ) : (
        <ImplementationList selectedNodeId={selectedNodeId} />
      )}
      */}
    </>
  );
};
