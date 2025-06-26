

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
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
  totalNodeCount
}) => {
  return <div>
      <div className="flex items-center justify-between bg-white px-4 rounded-lg">
        <div className="flex items-center gap-1 text-sm font-medium" style={{
        color: '#5F729F'
      }}>
          <span className="text-base font-normal">{scenarioCount}シナリオ</span>
          <Badge 
            className="text-xs px-2 py-0.5 text-white border-0 font-light" 
            style={{ backgroundColor: '#5F729E' }}
          >
            {totalNodeCount}ノード
          </Badge>
        </div>
        <ToggleGroup type="single" value={cardLayout} onValueChange={value => value && onLayoutChange(value as CardLayoutMode)} className="p-1 rounded-lg bg-white">
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
    </div>;
};

