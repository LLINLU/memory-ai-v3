
import React from "react";
import { Navigation } from "@/components/Navigation";
import { SearchBar } from "@/components/search-results/SearchBar";
import { SearchCriteria } from "@/components/search-results/SearchCriteria";
import { ResultsHeader } from "@/components/search-results/ResultsHeader";
import { ResultsTabs } from "@/components/search-results/ResultsTabs";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FilterSort } from "@/components/technology-tree/FilterSort";

const SearchResults = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50">
          <Navigation className="sticky top-0 z-20" />
          <div className="relative">
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
            <div className="sticky top-16 z-10 bg-gray-50">
              <SearchBar />
              <SearchCriteria />
              <ResultsHeader />
              <FilterSort className="ml-4 mb-4" />
            </div>
            <ResultsTabs />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SearchResults;
