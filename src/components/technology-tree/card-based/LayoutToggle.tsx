
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SingleRowIcon } from './SingleRowIcon';
import { ThreeColumnsIcon } from './ThreeColumnsIcon';
import { TwoByTwoGridIcon } from './TwoByTwoGridIcon';
import { ThreeColumnsWideIcon } from './ThreeColumnsWideIcon';

type CardLayoutMode = "single-row" | "one-per-row" | "two-per-row" | "three-per-row";

interface LayoutToggleProps {
  cardLayout: CardLayoutMode;
  onLayoutChange: (layout: CardLayoutMode) => void;
  scenarioCount: number;
  totalNodeCount: number;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({
  cardLayout,
  onLayoutChange,
  scenarioCount,
  totalNodeCount,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between bg-white px-4 rounded-lg">
        <div className="text-sm font-medium" style={{ color: '#5F729F' }}>
          {scenarioCount}シナリオ({totalNodeCount}ノード)
        </div>
        <ToggleGroup 
          type="single" 
          value={cardLayout} 
          onValueChange={(value) => value && onLayoutChange(value as CardLayoutMode)}
          className="bg-gray-50 p-1 rounded-lg"
        >
          <ToggleGroupItem value="single-row" aria-label="Single row layout" className="data-[state=on]:bg-white data-[state=off]:opacity-60">
            <SingleRowIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="one-per-row" aria-label="One card per row" className="data-[state=on]:bg-white data-[state=off]:opacity-60">
            <ThreeColumnsIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="two-per-row" aria-label="Two cards per row" className="data-[state=on]:bg-white data-[state=off]:opacity-60">
            <TwoByTwoGridIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="three-per-row" aria-label="Three cards per row" className="data-[state=on]:bg-white data-[state=off]:opacity-60">
            <ThreeColumnsWideIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
