import React from "react";
import { Loader2 } from "lucide-react";

interface NodeEnrichmentIndicatorProps {
  size?: "sm" | "md" | "lg";
}

export const NodeEnrichmentIndicator: React.FC<NodeEnrichmentIndicatorProps> = ({
  size = "sm",
}) => {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSizeClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center justify-center text-red-600">
      <Loader2 className={`animate-spin mr-2 ${sizeClasses}`} />
      <span className={`${textSizeClass} font-semibold`}>
        論文・事例を検索中
      </span>
    </div>
  );
};
