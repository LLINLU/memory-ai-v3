import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="mb-0" style={{ paddingTop: "0rem" }}>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Switch
            checked={showPath}
            onCheckedChange={setShowPath}
          />
          <span className="text-xs text-gray-500">
            パンくずリストを{showPath ? '隠す' : '表示'}
          </span>
        </div>
        
        {showPath && (
          <p className="text-gray-600 ml-4" style={{ fontSize: "14px" }}>
            {level1Name && level1Name}
            {level2Name && ` → ${level2Name}`}
            {level3Name && ` → ${level3Name}`}
            {level4Name && ` → ${level4Name}`}
            {level5Name && ` → ${level5Name}`}
            {level6Name && ` → ${level6Name}`}
            {level7Name && ` → ${level7Name}`}
            {level8Name && ` → ${level8Name}`}
            {level9Name && ` → ${level9Name}`}
            {level10Name && ` → ${level10Name}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PathDisplay;
