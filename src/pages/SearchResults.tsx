
import React from "react";
import { Navigation } from "@/components/Navigation";
import { SearchBar } from "@/components/search-results/SearchBar";
import { SearchCriteria } from "@/components/search-results/SearchCriteria";
import { ResultsHeader } from "@/components/search-results/ResultsHeader";
import { ResultsTabs } from "@/components/search-results/ResultsTabs";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const SearchResults = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 pb-12">
          <Navigation />
          <div className="relative">
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
            <SearchBar />
            <SearchCriteria />
            <ResultsHeader />
            <ResultsTabs />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SearchResults;
