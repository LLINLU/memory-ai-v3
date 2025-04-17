
import React from "react";
import { Menu as FilterIcon, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface FilterSortProps {
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
  className?: string;
}

export const FilterSort = ({ onFilterChange, onSortChange, className }: FilterSortProps) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Time Period</DropdownMenuLabel>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("past-year")}>
            Past year
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("past-5-years")}>
            Past 5 years
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("past-10-years")}>
            Past 10 years
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Citations</DropdownMenuLabel>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("citations-10")}>
            10+ citations
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("citations-50")}>
            50+ citations
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("citations-100")}>
            100+ citations
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Region</DropdownMenuLabel>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("domestic")}>
            Domestic
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => onFilterChange?.("international")}>
            International
          </DropdownMenuCheckboxItem>
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
