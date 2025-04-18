
import React, { useState, useEffect } from "react";
import { usePapers } from "@/hooks/usePapers";
import { PaginationControls } from "./components/PaginationControls";
import { PaperItems } from "./components/PaperItems";

export const PaperList = () => {
  const [currentPaperSet, setCurrentPaperSet] = useState<'default' | 'updated'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  const { data: papers = [], isLoading } = usePapers(currentPaperSet);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refreshing papers...");
      setCurrentPaperSet('updated');
      setCurrentPage(1);
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, []);

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading papers...</div>;
  }

  const totalPages = Math.ceil(papers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePapers = papers.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PaperItems papers={visiblePapers} />
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
