
import React from "react";
import { Menu as FilterIcon, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => onFilterChange?.("all")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange?.("recent")}>
            Recent only
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange?.("featured")}>
            Featured
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
