import React, { useState } from "react";
import { Menu as FilterIcon, ArrowDownUp } from "lucide-react";
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

export const FilterSort = ({ onFilterChange, onSortChange, className }: FilterSortProps) => {
  const [selectedFilters, setSelectedFilters] = useState({
    timePeriod: "",
    citations: "",
    region: ""
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const handleFilterSelect = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const newValue = prev[category] === value ? "" : value;
      const newFilters = { ...prev, [category]: newValue };
      onFilterChange?.(Object.values(newFilters).filter(Boolean).join(","));
      return newFilters;
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56" 
          align="start"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={() => {
            setFilterOpen(false);
          }}
        >
          <DropdownMenuLabel>Time Period</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("timePeriod", "past-year")}
            className={selectedFilters.timePeriod === "past-year" ? "bg-accent" : ""}
          >
            Past year
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("timePeriod", "past-5-years")}
            className={selectedFilters.timePeriod === "past-5-years" ? "bg-accent" : ""}
          >
            Past 5 years
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("timePeriod", "past-10-years")}
            className={selectedFilters.timePeriod === "past-10-years" ? "bg-accent" : ""}
          >
            Past 10 years
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Citations</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("citations", "citations-10")}
            className={selectedFilters.citations === "citations-10" ? "bg-accent" : ""}
          >
            10+ citations
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("citations", "citations-50")}
            className={selectedFilters.citations === "citations-50" ? "bg-accent" : ""}
          >
            50+ citations
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("citations", "citations-100")}
            className={selectedFilters.citations === "citations-100" ? "bg-accent" : ""}
          >
            100+ citations
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("region", "domestic")}
            className={selectedFilters.region === "domestic" ? "bg-accent" : ""}
          >
            Domestic
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("region", "international")}
            className={selectedFilters.region === "international" ? "bg-accent" : ""}
          >
            International
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleFilterSelect("region", "both")}
            className={selectedFilters.region === "both" ? "bg-accent" : ""}
          >
            Both
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowDownUp className="h-4 w-4" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
