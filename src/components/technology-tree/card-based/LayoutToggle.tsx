
import React from 'react';
import { Square, RectangleVertical, Columns2, Columns3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type CardLayoutMode = "single-row" | "one-per-row" | "two-per-row" | "three-per-row";

interface LayoutToggleProps {
  cardLayout: CardLayoutMode;
  onLayoutChange: (layout: CardLayoutMode) => void;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({
  cardLayout,
  onLayoutChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-end">
        <ToggleGroup 
          type="single" 
          value={cardLayout} 
          onValueChange={(value) => value && onLayoutChange(value as CardLayoutMode)}
          className="bg-gray-50 p-1 rounded-lg"
        >
          <ToggleGroupItem value="single-row" aria-label="Single row layout" className="data-[state=on]:bg-white">
            <Square className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="one-per-row" aria-label="One card per row" className="data-[state=on]:bg-white">
            <RectangleVertical className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="two-per-row" aria-label="Two cards per row" className="data-[state=on]:bg-white">
            <Columns2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="three-per-row" aria-label="Three cards per row" className="data-[state=on]:bg-white">
            <Columns3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
