
import React from "react";
import { PageLayout } from "@/components/search-results/PageLayout";
import { SearchResultsContent } from "@/components/search-results/SearchResultsContent";

const SearchResults = () => {
  return (
    <PageLayout defaultOpen={false}>
      <SearchResultsContent />
    </PageLayout>
  );
};

export default SearchResults;
