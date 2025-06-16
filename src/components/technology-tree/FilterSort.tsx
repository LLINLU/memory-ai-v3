import React, { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface FilterSortProps {
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
  className?: string;
}

export const FilterSort = ({
  onFilterChange,
  onSortChange,
  className,
}: FilterSortProps) => {
  const [selectedFilters, setSelectedFilters] = useState({
    timePeriod: "",
    citations: "",
    region: "",
    completeness: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const handleFilterSelect = (
    category: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const newValue = prev[category] === value ? "" : value;
      const newFilters = { ...prev, [category]: newValue };
      onFilterChange?.(Object.values(newFilters).filter(Boolean).join(","));
      return newFilters;
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-700">
            <SlidersHorizontal className="h-4 w-4" />
            フィルター
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenuLabel>Time Period</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("timePeriod", "past-year");
            }}
            className="flex items-center justify-between"
          >
            Past year
            {selectedFilters.timePeriod === "past-year" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("timePeriod", "past-5-years");
            }}
            className="flex items-center justify-between"
          >
            Past 5 years
            {selectedFilters.timePeriod === "past-5-years" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("timePeriod", "past-10-years");
            }}
            className="flex items-center justify-between"
          >
            Past 10 years
            {selectedFilters.timePeriod === "past-10-years" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Citations</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "any");
            }}
            className="flex items-center justify-between"
          >
            Any (including 0)
            {selectedFilters.citations === "any" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-0");
            }}
            className="flex items-center justify-between"
          >
            0 citations
            {selectedFilters.citations === "citations-0" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-10");
            }}
            className="flex items-center justify-between"
          >
            10+ citations
            {selectedFilters.citations === "citations-10" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-50");
            }}
            className="flex items-center justify-between"
          >
            50+ citations
            {selectedFilters.citations === "citations-50" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-100");
            }}
            className="flex items-center justify-between"
          >
            100+ citations
            {selectedFilters.citations === "citations-100" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Author/Journal Info</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("completeness", "complete");
            }}
            className="flex items-center justify-between"
          >
            Complete info only
            {selectedFilters.completeness === "complete" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("completeness", "incomplete");
            }}
            className="flex items-center justify-between"
          >
            Missing author/journal
            {selectedFilters.completeness === "incomplete" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("completeness", "all");
            }}
            className="flex items-center justify-between"
          >
            All papers
            {selectedFilters.completeness === "all" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "domestic");
            }}
            className="flex items-center justify-between"
          >
            Domestic
            {selectedFilters.region === "domestic" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "international");
            }}
            className="flex items-center justify-between"
          >
            International
            {selectedFilters.region === "international" && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "both");
            }}
            className="flex items-center justify-between"
          >
            Both
            {selectedFilters.region === "both" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-700">
            <ArrowUpDown className="h-4 w-4" />
            並び替え
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onSortChange?.("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSortChange?.("oldest")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSortChange?.("citations")}>
            Most Citations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
