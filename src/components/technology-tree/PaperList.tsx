import React from "react";
import { PaperCard } from "./PaperCard";
import { PaginationControls } from "./components/PaginationControls";
import { usePaperList } from "./hooks/usePaperList";

interface PaperListProps {
  selectedNodeId?: string;
  filterString?: string;
  sortBy?: string;
}

export const PaperList = ({
  selectedNodeId,
  filterString,
  sortBy,
}: PaperListProps) => {
  const {
    papers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refreshKey,
    loading,
    onFilterChange,
    onSortChange,
  } = usePaperList(selectedNodeId, filterString, sortBy); // Show loading state when fetching real data
  if (selectedNodeId && loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show empty state when no papers are available
  if (papers.length === 0) {
    if (!selectedNodeId) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">ノードを選択して論文を表示</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">
            この技術の論文はまだありません
          </p>
        </div>
      );
    }
  }

  return (
    <>
      <ul className="w-full space-y-4">
        {papers.map((paper, index) => (
          <PaperCard
            key={`${refreshKey}-${index}`}
            title={paper.title}
            authors={paper.authors}
            journal={paper.journal}
            tags={paper.tags}
            abstract={paper.abstract}
            date={paper.date}
            citations={(paper as any).citations}
          />
        ))}
      </ul>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </>
  );
};
