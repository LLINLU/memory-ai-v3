
import React, { useState, useEffect } from "react";
import { PaperCard } from "./PaperCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const paperSets = {
  default: [
    {
      title: {
        japanese: "高解像度適応光学走査レーザー検眼鏡による糖尿病網膜症の細胞レベル評価",
        english: "(Cellular-level Assessment of Diabetic Retinopathy Using High-resolution AO-SLO)"
      },
      authors: "田中 健太, 佐藤 明子, 山田 雄一",
      journal: "日本眼科学会誌",
      tags: ["AO-SLO", "糖尿病網膜症"],
      abstract: "This study investigates the application of adaptive optics scanning laser ophthalmoscopy (AO-SLO) for early detection of cellular changes in diabetic retinopathy. The research demonstrates improved visualization of retinal microvasculature and photoreceptor abnormalities before clinical symptoms appear.",
      date: "2024-04-19"
    },
    {
      title: {
        english: "Multi-Modal Adaptive Optics Imaging Combined with OCT for Enhanced Retinal Diagnostics"
      },
      authors: "J. Zhang, M. Williams, K. Yamada",
      journal: "American Journal of Ophthalmology",
      tags: ["AO-OCT", "Multi-Modal"],
      abstract: "This paper presents a novel approach combining adaptive optics with optical coherence tomography for comprehensive retinal imaging. The multi-modal system achieves unprecedented resolution for in vivo assessment of retinal layers, offering new insights into pathophysiology of macular degeneration.",
      date: "2024-04-19"
    }
  ],
  updated: [
    {
      title: {
        japanese: "補償光学の眼科分野への利用",
        english: "(Adaptive Optics in Ophthalmology)"
      },
      authors: "鈴木 誠一, 高橋 直子, 山本 裕子",
      journal: "先端医療技術研究",
      tags: ["AO-SLO", "眼科", "イメージング"],
      abstract: "This comprehensive review examines the growing applications of adaptive optics in ophthalmology. The paper discusses recent technological advancements, clinical implementations, and future directions for improving retinal imaging and diagnosis of ocular diseases.",
      date: "2024-04-15"
    },
    {
      title: {
        english: "Clinical Value of Adaptive Optics in Diagnosis of Early-Stage Glaucoma"
      },
      authors: "L. Chen, A. Rodriguez, T. Nakamura",
      journal: "Journal of Clinical Ophthalmology",
      tags: ["Glaucoma", "Early Detection"],
      abstract: "This research demonstrates how adaptive optics can significantly improve the early detection of glaucoma by enabling visualization of individual nerve fiber layer defects before conventional diagnostic methods can detect them. The study includes a 3-year follow-up comparison with standard OCT imaging.",
      date: "2024-04-12"
    },
    {
      title: {
        english: "High-Resolution Imaging of Photoreceptor Mosaic in Retinitis Pigmentosa Using Adaptive Optics"
      },
      authors: "D. Johnson, M. Suzuki, H. Kim",
      journal: "Retinal Disease Research",
      tags: ["Retinitis Pigmentosa", "Photoreceptors"],
      abstract: "Using advanced adaptive optics technology, this study maps the progressive degeneration of photoreceptor cells in patients with retinitis pigmentosa. The research provides new insights into disease progression patterns and potential therapeutic windows for intervention.",
      date: "2024-04-10"
    }
  ]
};

export const PaperList = () => {
  const [currentPaperSet, setCurrentPaperSet] = useState('default');
  const [papers, setPapers] = useState(paperSets.default);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  useEffect(() => {
    setPapers(paperSets[currentPaperSet]);
  }, [currentPaperSet]);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refreshing papers...");
      setCurrentPaperSet('updated');
      setRefreshKey(prev => prev + 1);
      setCurrentPage(1);
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, []);

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
