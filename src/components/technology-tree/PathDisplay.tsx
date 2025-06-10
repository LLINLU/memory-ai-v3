import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PathDisplayProps {
  selectedPath: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
    level5?: string;
    level6?: string;
    level7?: string;
    level8?: string;
    level9?: string;
    level10?: string;
  };
  level1Items: any[];
  level2Items: Record<string, any[]>;
  level3Items: Record<string, any[]>;
  level4Items: Record<string, any[]>;
  level5Items?: Record<string, any[]>;
  level6Items?: Record<string, any[]>;
  level7Items?: Record<string, any[]>;
  level8Items?: Record<string, any[]>;
  level9Items?: Record<string, any[]>;
  level10Items?: Record<string, any[]>;
  showLevel4: boolean;
  onGuidanceClick?: (type: string) => void;
  // Navigation control props
  onScrollToStart?: () => void;
  onScrollToEnd?: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  lastVisibleLevel?: number;
}

export const PathDisplay = ({
  selectedPath,
  level1Items,
  level2Items,
  level3Items,
  level4Items,
  level5Items = {},
  level6Items = {},
  level7Items = {},
  level8Items = {},
  level9Items = {},
  level10Items = {},
  showLevel4,
  onGuidanceClick,
  onScrollToStart,
  onScrollToEnd,
  canScrollLeft = false,
  canScrollRight = false,
  lastVisibleLevel = 3,
}: PathDisplayProps) => {
  const [showPath, setShowPath] = useState(false);

  // Find the selected items by ID to display their names
  const findItemName = (itemId: string, items: any[]) => {
    const item = items.find((item) => item.id === itemId);
    return item ? item.name : "";
  };

  // Extract only the Japanese part of the name (before the English part in parentheses)
  const getJapaneseName = (name: string) => {
    // Check if the name contains both Japanese and English parts
    const match = name.match(/^(.+?)\s*\(\([^)]+\)\)$/);
    if (match) {
      return match[1].trim();
    }
    // If no English part found, return the original name
    return name;
  };

  const level1Name = selectedPath.level1
    ? getJapaneseName(findItemName(selectedPath.level1, level1Items))
    : "";

  const level2Name =
    selectedPath.level2 && selectedPath.level1
      ? getJapaneseName(
          findItemName(
            selectedPath.level2,
            level2Items[selectedPath.level1] || []
          )
        )
      : "";
  const level3Name =
    selectedPath.level3 && selectedPath.level2
      ? getJapaneseName(
          findItemName(
            selectedPath.level3,
            level3Items[selectedPath.level2] || []
          )
        )
      : "";
  const level4Name =
    selectedPath.level4 && selectedPath.level3
      ? getJapaneseName(
          findItemName(
            selectedPath.level4,
            level4Items[selectedPath.level3] || []
          )
        )
      : "";

  const level5Name =
    selectedPath.level5 && selectedPath.level4
      ? getJapaneseName(
          findItemName(
            selectedPath.level5,
            level5Items[selectedPath.level4] || []
          )
        )
      : "";

  const level6Name =
    selectedPath.level6 && selectedPath.level5
      ? getJapaneseName(
          findItemName(
            selectedPath.level6,
            level6Items[selectedPath.level5] || []
          )
        )
      : "";

  const level7Name =
    selectedPath.level7 && selectedPath.level6
      ? getJapaneseName(
          findItemName(
            selectedPath.level7,
            level7Items[selectedPath.level6] || []
          )
        )
      : "";

  const level8Name =
    selectedPath.level8 && selectedPath.level7
      ? getJapaneseName(
          findItemName(
            selectedPath.level8,
            level8Items[selectedPath.level7] || []
          )
        )
      : "";

  const level9Name =
    selectedPath.level9 && selectedPath.level8
      ? getJapaneseName(
          findItemName(
            selectedPath.level9,
            level9Items[selectedPath.level8] || []
          )
        )
      : "";

  const level10Name =
    selectedPath.level10 && selectedPath.level9
      ? getJapaneseName(
          findItemName(
            selectedPath.level10,
            level10Items[selectedPath.level9] || []
          )
        )
      : "";

  const handleGuidanceItemClick = (type: string) => {
    if (onGuidanceClick) {
      onGuidanceClick(type);
    }
  };

  // Component to render level number in a circle
  const LevelCircle = ({ level }: { level: number }) => (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-medium mr-1">
      {level}
    </span>
  );

  return (
    <div className="mb-0" style={{ paddingTop: "0rem" }}>
      {/* First row: Navigation controls (left) + Toggle switch (right) */}
      <div className="flex items-center justify-between mb-2">
        {/* Left side: Navigation controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={200} skipDelayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onScrollToStart}
                  disabled={!canScrollLeft}
                  className={`h-8 w-8 p-0 border-[#4877e5] ${
                    !canScrollLeft ? "opacity-50" : ""
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>レベル1に戻る</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onScrollToEnd}
                  disabled={!canScrollRight}
                  className={`h-8 w-8 p-0 border-[#4877e5] ${
                    !canScrollRight ? "opacity-50" : ""
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>レベル{lastVisibleLevel}まで進む</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Right side: Toggle switch */}
        <div className="flex items-center gap-2">
          <Switch
            checked={showPath}
            onCheckedChange={setShowPath}
          />
          <span className="text-xs text-gray-500">
            パンくずリストを{showPath ? '隠す' : '表示'}
          </span>
        </div>
      </div>

      {/* Second row: Breadcrumb path (conditional) */}
      {showPath && (
        <div className="mb-2">
          <p className="text-gray-600 flex items-center flex-wrap" style={{ fontSize: "14px" }}>
            {level1Name && (
              <span className="flex items-center">
                <LevelCircle level={1} />
                {level1Name}
              </span>
            )}
            {level2Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={2} />
                {level2Name}
              </span>
            )}
            {level3Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={3} />
                {level3Name}
              </span>
            )}
            {level4Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={4} />
                {level4Name}
              </span>
            )}
            {level5Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={5} />
                {level5Name}
              </span>
            )}
            {level6Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={6} />
                {level6Name}
              </span>
            )}
            {level7Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={7} />
                {level7Name}
              </span>
            )}
            {level8Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={8} />
                {level8Name}
              </span>
            )}
            {level9Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={9} />
                {level9Name}
              </span>
            )}
            {level10Name && (
              <span className="flex items-center">
                <span className="mx-2">→</span>
                <LevelCircle level={10} />
                {level10Name}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PathDisplay;

}
