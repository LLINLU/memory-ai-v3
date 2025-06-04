
import React, { useEffect } from "react";
import { PageLayout } from "@/components/search-results/PageLayout";
import { SearchResultsContent } from "@/components/search-results/SearchResultsContent";
import { useSidebar } from "@/hooks/use-sidebar";

const SearchResultsContentWrapper = () => {
  const { setOpen } = useSidebar();

  // Force sidebar closed on mount
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return <SearchResultsContent />;
};

const SearchResults = () => {
  return (
    <PageLayout>
      <SearchResultsContent />
    </PageLayout>
  );
};

export default SearchResults;
