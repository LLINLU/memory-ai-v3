
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc } from "lucide-react";

interface FilterSortProps {
  className?: string;
}

export const FilterSort: React.FC<FilterSortProps> = ({ className }: FilterSortProps) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Filter className="h-3.5 w-3.5" />
        <span>フィルター</span>
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <SortAsc className="h-3.5 w-3.5" />
        <span>並べ替え</span>
      </Button>
    </div>
  );
};
