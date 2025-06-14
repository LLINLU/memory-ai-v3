import React from "react";
import { TreeNode } from "@/types/tree";
import { NodeLoadingIndicator } from "./NodeLoadingIndicator";

interface NodeContentProps {
  item: TreeNode;
  isSelected: boolean;
  isHovered: boolean;
  level?: number;
}

export const NodeContent: React.FC<NodeContentProps> = ({
  item,
  isSelected,
  isHovered,
  level,
}) => {
  // Force white text for better contrast on blue backgrounds
  const textColorClass = isSelected ? "text-white" : "text-gray-800";
  const descriptionTextColor = isSelected ? "text-gray-100" : "text-gray-600";

  // Extract only the Japanese part of the title (before the English part in parentheses)
  const getJapaneseTitle = (name: string) => {
    // Check if the name contains both Japanese and English parts
    const match = name.match(/^(.+?)\s*\(\([^)]+\)\)$/);
    if (match) {
      return match[1].trim();
    }
    // If no English part found, return the original name
    return name;
  };
  const japaneseTitle = getJapaneseTitle(item.name);
  // Check if this node is being generated (children_count = 0 for TED scenario nodes only)
  // Only Level 1 nodes (scenarios) should show generating status when children_count = 0
  // Level 4+ nodes naturally have children_count = 0 as leaf nodes
  const isGenerating =
    typeof item.children_count === "number" && 
    item.children_count === 0 && 
    level === 1; // Only show generating for Level 1 (scenario) nodes

  return (
    <div className="flex flex-col w-full">
      {/* Display only the Japanese title */}
      <h4
        className={`text-base leading-6 font-medium ${textColorClass} break-words`}
      >
        {japaneseTitle}
      </h4>

      {/* Show loading indicator if node is being generated */}
      {isGenerating && (
        <div className="mt-2">
          <NodeLoadingIndicator size="sm" />
        </div>
      )}

      {/* Always show info if it exists and not generating */}
      {item.info && !isGenerating && (
        <p className={`text-xs mt-1 ${textColorClass} break-words`}>
          {item.info}
        </p>
      )}

      {/* Only display description when hovered */}
      {isHovered && item.description && (
        <p className={`mt-3 text-sm ${descriptionTextColor} break-words`}>
          {item.description}
        </p>
      )}
    </div>
  );
};
