
import React from "react";
import { Navigation } from "@/components/Navigation";
import { SearchBar } from "@/components/search-results/SearchBar";
import { SearchCriteria } from "@/components/search-results/SearchCriteria";
import { ResultsHeader } from "@/components/search-results/ResultsHeader";
import { ResultsTabs } from "@/components/search-results/ResultsTabs";

const SearchResults = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navigation />
      <SearchBar />
      <SearchCriteria />
      <ResultsHeader />
      <ResultsTabs />
    </div>
  );
};

export default SearchResults;
