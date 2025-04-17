import React, { useState } from "react";
import { Menu as FilterIcon, ArrowDownUp, Check } from "lucide-react";
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
            className="flex items-center"
          >
            {selectedFilters.timePeriod === "past-year" && <Check className="h-4 w-4 mr-2" />}
            Past year
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("timePeriod", "past-5-years");
            }}
            className="flex items-center"
          >
            {selectedFilters.timePeriod === "past-5-years" && <Check className="h-4 w-4 mr-2" />}
            Past 5 years
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("timePeriod", "past-10-years");
            }}
            className="flex items-center"
          >
            {selectedFilters.timePeriod === "past-10-years" && <Check className="h-4 w-4 mr-2" />}
            Past 10 years
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Citations</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-10");
            }}
            className="flex items-center"
          >
            {selectedFilters.citations === "citations-10" && <Check className="h-4 w-4 mr-2" />}
            10+ citations
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-50");
            }}
            className="flex items-center"
          >
            {selectedFilters.citations === "citations-50" && <Check className="h-4 w-4 mr-2" />}
            50+ citations
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("citations", "citations-100");
            }}
            className="flex items-center"
          >
            {selectedFilters.citations === "citations-100" && <Check className="h-4 w-4 mr-2" />}
            100+ citations
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "domestic");
            }}
            className="flex items-center"
          >
            {selectedFilters.region === "domestic" && <Check className="h-4 w-4 mr-2" />}
            Domestic
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "international");
            }}
            className="flex items-center"
          >
            {selectedFilters.region === "international" && <Check className="h-4 w-4 mr-2" />}
            International
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleFilterSelect("region", "both");
            }}
            className="flex items-center"
          >
            {selectedFilters.region === "both" && <Check className="h-4 w-4 mr-2" />}
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
