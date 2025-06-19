import { useState, useEffect } from "react";
import { paperSets } from "../data/paperSets";
import { useEnrichedData } from "@/hooks/useEnrichedData";

export const usePaperList = (
  selectedNodeId?: string,
  externalFilterString?: string,
  externalSortBy?: string
) => {
  const [currentPaperSet, setCurrentPaperSet] = useState("default");
  const [papers, setPapers] = useState(paperSets.default);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState({
    timePeriod: "",
    citations: "",
    region: "",
    completeness: "",
  });
  const [sortBy, setSortBy] = useState("");
  // Use external filter/sort if provided, otherwise use internal state
  const activeFilters = externalFilterString
    ? (() => {
        const filterArray = externalFilterString.split(",").filter(Boolean);
        const newFilters = {
          timePeriod: "",
          citations: "",
          region: "",
          completeness: "",
        };

        filterArray.forEach((filter) => {
          if (filter.includes("past-")) {
            newFilters.timePeriod = filter;
          } else if (filter.includes("citations-") || filter === "any") {
            newFilters.citations = filter;
          } else if (["domestic", "international", "both"].includes(filter)) {
            newFilters.region = filter;
          } else if (["complete", "incomplete", "all"].includes(filter)) {
            newFilters.completeness = filter;
          }
        });

        return newFilters;
      })()
    : filters;

  const activeSortBy = externalSortBy || sortBy;

  // Use real data from database when node is selected
  const { papers: realPapers, loadingPapers } = useEnrichedData(
    selectedNodeId || null
  );
  // Transform real data to match the expected format for PaperCard
  const transformedRealPapers = realPapers.map((paper) => ({
    title: {
      english: paper.title,
    },
    authors: paper.authors,
    journal: paper.journal,
    tags: paper.tags,
    abstract: paper.abstract,
    date: paper.date,
    citations: paper.citations || 0,
    region: paper.region || "domestic",
    doi: paper.doi,
    score: paper.score,
  })); // Use real data if available, otherwise show empty if no node selected
  const basePapers =
    selectedNodeId && transformedRealPapers.length > 0
      ? transformedRealPapers
      : selectedNodeId
      ? [] // Show empty array when node is selected but no real data
      : []; // Show empty array when no node is selected// Apply filters
  const filteredPapers = basePapers.filter((paper) => {
    // Time period filter
    if (activeFilters.timePeriod) {
      const paperYear = new Date(paper.date).getFullYear();
      const currentYear = new Date().getFullYear();

      switch (activeFilters.timePeriod) {
        case "past-year":
          if (currentYear - paperYear > 1) return false;
          break;
        case "past-5-years":
          if (currentYear - paperYear > 5) return false;
          break;
        case "past-10-years":
          if (currentYear - paperYear > 10) return false;
          break;
      }
    } // Citations filter (only apply if the paper has citations property)
    if (activeFilters.citations && "citations" in paper) {
      const citations = (paper as any).citations || 0;
      switch (activeFilters.citations) {
        case "any":
          // Show all papers including those with 0 citations
          break;
        case "citations-0":
          if (citations !== 0) return false;
          break;
        case "citations-10":
          if (citations < 10) return false;
          break;
        case "citations-50":
          if (citations < 50) return false;
          break;
        case "citations-100":
          if (citations < 100) return false;
          break;
      }
    } // Region filter (only apply if the paper has region property)
    if (
      activeFilters.region &&
      activeFilters.region !== "both" &&
      "region" in paper
    ) {
      if ((paper as any).region !== activeFilters.region) return false;
    }

    // Completeness filter
    if (activeFilters.completeness) {
      const hasCompleteInfo = paper.authors && paper.journal;
      switch (activeFilters.completeness) {
        case "complete":
          if (!hasCompleteInfo) return false;
          break;
        case "incomplete":
          if (hasCompleteInfo) return false;
          break;
        case "all":
          // Show all papers regardless of completeness
          break;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    switch (activeSortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "citations":
        const aCitations = "citations" in a ? (a as any).citations || 0 : 0;
        const bCitations = "citations" in b ? (b as any).citations || 0 : 0;
        return bCitations - aCitations;
      default:
        return 0;
    }
  });

  const finalPapers = sortedPapers;

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      console.log("Refreshing papers with event:", event);
      const customEvent = event as CustomEvent;

      if (customEvent.detail) {
        console.log("Refresh detail:", customEvent.detail);

        if (
          customEvent.detail.nodeId &&
          customEvent.detail.nodeId.includes("refined")
        ) {
          setCurrentPaperSet("customNode");
          setPapers(paperSets.customNode);
        } else if (
          customEvent.detail.nodeId &&
          paperSets[customEvent.detail.nodeId]
        ) {
          setCurrentPaperSet(customEvent.detail.nodeId);
          setPapers(paperSets[customEvent.detail.nodeId]);
        } else {
          setCurrentPaperSet("updated");
          setPapers(paperSets.updated);
        }
      } else {
        setCurrentPaperSet("updated");
        setPapers(paperSets.updated);
      }

      setRefreshKey((prev) => prev + 1);
      setCurrentPage(1);

      setTimeout(() => {
        const sidebarContent = document.querySelector(
          '[data-sidebar="content"]'
        );
        if (sidebarContent) {
          sidebarContent.scrollTop = 0;
        }
      }, 100);
    };

    document.addEventListener("refresh-papers", handleRefresh);
    return () => {
      document.removeEventListener("refresh-papers", handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (paperSets[currentPaperSet]) {
      setPapers(paperSets[currentPaperSet]);
    } else {
      setPapers(paperSets.default);
    }
  }, [currentPaperSet]); // Reset pagination when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeFilters.timePeriod,
    activeFilters.citations,
    activeFilters.region,
    activeFilters.completeness,
    activeSortBy,
  ]);
  const handleFilterChange = (filterString: string) => {
    const filterArray = filterString.split(",").filter(Boolean);
    const newFilters = {
      timePeriod: "",
      citations: "",
      region: "",
      completeness: "",
    };

    filterArray.forEach((filter) => {
      if (filter.includes("past-")) {
        newFilters.timePeriod = filter;
      } else if (filter.includes("citations-") || filter === "any") {
        newFilters.citations = filter;
      } else if (["domestic", "international", "both"].includes(filter)) {
        newFilters.region = filter;
      } else if (["complete", "incomplete", "all"].includes(filter)) {
        newFilters.completeness = filter;
      }
    });

    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };
  const totalPages = Math.ceil(finalPapers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePapers = finalPapers.slice(startIndex, startIndex + pageSize);
  return {
    papers: visiblePapers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refreshKey,
    loading: loadingPapers,
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
  };
};
