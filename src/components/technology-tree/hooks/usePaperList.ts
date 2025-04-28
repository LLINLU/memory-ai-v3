
import { useState, useEffect } from "react";
import { paperSets } from "../data/paperSets";

export const usePaperList = () => {
  const [currentPaperSet, setCurrentPaperSet] = useState('default');
  const [papers, setPapers] = useState(paperSets.default);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      console.log("Refreshing papers with event:", event);
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail) {
        console.log("Refresh detail:", customEvent.detail);
        
        if (customEvent.detail.nodeId && customEvent.detail.nodeId.includes('refined')) {
          setCurrentPaperSet('customNode');
          setPapers(paperSets.customNode);
        } 
        else if (customEvent.detail.nodeId && paperSets[customEvent.detail.nodeId]) {
          setCurrentPaperSet(customEvent.detail.nodeId);
          setPapers(paperSets[customEvent.detail.nodeId]);
        }
        else {
          setCurrentPaperSet('updated');
          setPapers(paperSets.updated);
        }
      } else {
        setCurrentPaperSet('updated');
        setPapers(paperSets.updated);
      }
      
      setRefreshKey(prev => prev + 1);
      setCurrentPage(1);
      
      setTimeout(() => {
        const sidebarContent = document.querySelector('[data-sidebar="content"]');
        if (sidebarContent) {
          sidebarContent.scrollTop = 0;
        }
      }, 100);
    };
    
    document.addEventListener('refresh-papers', handleRefresh);
    return () => {
      document.removeEventListener('refresh-papers', handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (paperSets[currentPaperSet]) {
      setPapers(paperSets[currentPaperSet]);
    } else {
      setPapers(paperSets.default);
    }
  }, [currentPaperSet]);

  const totalPages = Math.ceil(papers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePapers = papers.slice(startIndex, startIndex + pageSize);

  return {
    papers: visiblePapers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refreshKey
  };
};
