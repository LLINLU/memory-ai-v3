
import React, { useState, useEffect } from "react";
import { PaperCard } from "./PaperCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePapers } from "@/hooks/usePapers";
import { Paper } from "@/data/paperData";

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
      <ul className="w-full space-y-4">
        {visiblePapers.map((paper, index) => (
          <PaperCard
            key={index}
            title={paper.title}
            authors={paper.authors}
            journal={paper.journal}
            tags={paper.tags}
            abstract={paper.abstract}
            date={paper.date}
          />
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Select value={pageSize.toString()} onValueChange={(value) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Papers per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="15">15 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
