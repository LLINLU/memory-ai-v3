
import React, { useState } from "react";
import { Menu as FilterIcon, ArrowDownUp, Check } from "lucide-react";
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
      // If the value is already selected, unselect it
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
          className="w-56 [&>div>div]:before:hidden" // Added class to remove circle
          align="start"
          onCloseAutoFocus={(e) => {
            // Prevent focus events from closing the dropdown
            e.preventDefault();
          }}
          onInteractOutside={() => {
            // Only close when clicking outside
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
              {selectedFilters.timePeriod === "past-year" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="past-5-years"
              onClick={() => handleFilterSelect("timePeriod", "past-5-years")}
            >
              Past 5 years
              {selectedFilters.timePeriod === "past-5-years" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="past-10-years"
              onClick={() => handleFilterSelect("timePeriod", "past-10-years")}
            >
              Past 10 years
              {selectedFilters.timePeriod === "past-10-years" && <Check className="ml-auto h-4 w-4" />}
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
              {selectedFilters.citations === "citations-10" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="citations-50"
              onClick={() => handleFilterSelect("citations", "citations-50")}
            >
              50+ citations
              {selectedFilters.citations === "citations-50" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="citations-100"
              onClick={() => handleFilterSelect("citations", "citations-100")}
            >
              100+ citations
              {selectedFilters.citations === "citations-100" && <Check className="ml-auto h-4 w-4" />}
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
              {selectedFilters.region === "domestic" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="international"
              onClick={() => handleFilterSelect("region", "international")}
            >
              International
              {selectedFilters.region === "international" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem 
              value="both"
              onClick={() => handleFilterSelect("region", "both")}
            >
              Both
              {selectedFilters.region === "both" && <Check className="ml-auto h-4 w-4" />}
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
