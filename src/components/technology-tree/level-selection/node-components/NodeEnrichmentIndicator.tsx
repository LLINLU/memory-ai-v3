import React from "react";
import { Loader2 } from "lucide-react";

interface NodeEnrichmentIndicatorProps {
  size?: "sm" | "md" | "lg";
  loadingPapers?: boolean;
  loadingUseCases?: boolean;
}

export const NodeEnrichmentIndicator: React.FC<NodeEnrichmentIndicatorProps> = ({
  size = "sm",
  loadingPapers = false,
  loadingUseCases = false,
}) => {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSizeClass = size === "sm" ? "text-xs" : "text-sm";

  // Build the loading message based on what's being loaded
  let loadingMessage = "";
  if (loadingPapers && loadingUseCases) {
    loadingMessage = "論文・事例を検索中";
  } else if (loadingPapers) {
    loadingMessage = "論文を検索中";
  } else if (loadingUseCases) {
    loadingMessage = "事例を検索中";
  } else {
    // This shouldn't happen, but fallback to general message
    loadingMessage = "データを検索中";
  }

  return (
    <div className="flex items-center justify-center text-red-600">
      <Loader2 className={`animate-spin mr-2 ${sizeClasses}`} />
      <span className={`${textSizeClass} font-semibold`}>
        {loadingMessage}
      </span>
    </div>
  );
};
