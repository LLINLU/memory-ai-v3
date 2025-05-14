
import React from "react";
import { SearchBar } from "./SearchBar";
import { SearchCriteria } from "./SearchCriteria";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsTabs } from "./ResultsTabs";

export const SearchResultsContent = () => {
  return (
    <>
      <SearchBar />
      <SearchCriteria />
      <ResultsHeader />
      <ResultsTabs />
    </>
  );
};
