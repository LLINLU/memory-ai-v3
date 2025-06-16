import React, { useState, useEffect, useRef } from "react";
import { PaperList } from "../PaperList";
import { ImplementationList } from "../ImplementationList";
import { FilterSort } from "../FilterSort";
import { TabNavigator } from "./TabNavigator";
import { Separator } from "@/components/ui/separator";
import { useEnrichedData } from "@/hooks/useEnrichedData";

interface TabContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  selectedNodeId?: string;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  onValueChange,
  selectedNodeId,
}) => {
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentSort, setCurrentSort] = useState("citations");

  // Get real enrichment data for the selected node
  const { papers, useCases } = useEnrichedData(selectedNodeId || null);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
  };

  const paperListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Expose the init function globally for Google
    (window as any).googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en", // or 'ja' for Japanese base content
            includedLanguages: "en,ja", // limit to English/Japanese
          },
          "google_translate_element"
        );
      }
    };

    // Only inject script once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  }, []);

  // Optionally: retrigger mutation for Google Translate on node change
  useEffect(() => {
    if (paperListRef.current) {
      setTimeout(() => {
        if (paperListRef.current) {
          paperListRef.current.style.outline = "";
        }
      }, 10);
    }
  }, [selectedNodeId]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <TabNavigator
          onValueChange={onValueChange}
          papersCount={papers.length}
          useCasesCount={useCases.length}
        />
        <FilterSort
          className="justify-end"
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>
      <div id="google_translate_element"></div>
      {/* 🚫 TEMPORARILY DISABLED - Use Cases Tab not production ready */}
      {/* Only show papers for now */}
      <div className="translate">
        <PaperList
          selectedNodeId={selectedNodeId}
          filterString={currentFilter}
          sortBy={currentSort}
        />
      </div>
      {/*
      {activeTab === "papers" ? (
        <PaperList
          selectedNodeId={selectedNodeId}
          filterString={currentFilter}
          sortBy={currentSort}
        />
      ) : (
        <ImplementationList selectedNodeId={selectedNodeId} />
      )}
      */}
    </>
  );
};
