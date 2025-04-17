import React, { useState } from "react";
import { Menu as FilterIcon, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
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
          className="w-56 [&>div>div]:before:hidden" 
          align="start"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={() => {
            setFilterOpen(false);
          }}
        >
          <DropdownMenuLabel>Time Period</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedFilters.timePeriod}>
            <DropdownMenuRadioItem 
              value="past-year"
              onClick={() => handleFilterSelect("timePeriod", "past-year")}
            >
              Past year
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="past-5-years"
              onClick={() => handleFilterSelect("timePeriod", "past-5-years")}
            >
              Past 5 years
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="past-10-years"
              onClick={() => handleFilterSelect("timePeriod", "past-10-years")}
            >
              Past 10 years
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Citations</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedFilters.citations}>
            <DropdownMenuRadioItem 
              value="citations-10"
              onClick={() => handleFilterSelect("citations", "citations-10")}
            >
              10+ citations
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="citations-50"
              onClick={() => handleFilterSelect("citations", "citations-50")}
            >
              50+ citations
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="citations-100"
              onClick={() => handleFilterSelect("citations", "citations-100")}
            >
              100+ citations
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedFilters.region}>
            <DropdownMenuRadioItem 
              value="domestic"
              onClick={() => handleFilterSelect("region", "domestic")}
            >
              Domestic
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="international"
              onClick={() => handleFilterSelect("region", "international")}
            >
              International
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="both"
              onClick={() => handleFilterSelect("region", "both")}
            >
              Both
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
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
