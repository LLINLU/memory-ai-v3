
import React from "react";
import { PaperCard } from "./PaperCard";
import { PaginationControls } from "./components/PaginationControls";
import { usePaperList } from "./hooks/usePaperList";

export const PaperList = () => {
  const {
    papers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refreshKey
  } = usePaperList();

  return (
    <div className="space-y-4">
      <ul className="w-full space-y-4 mb-4">
        {papers.map((paper, index) => (
          <PaperCard
            key={`${refreshKey}-${index}`}
            title={paper.title}
            authors={paper.authors}
            journal={paper.journal}
            tags={paper.tags}
            abstract={paper.abstract}
            date={paper.date}
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
    </div>
  );
};
