
import React from "react";
import { Loader2, Clock, AlertTriangle } from "lucide-react";
import { useEnrichmentQueue } from "@/hooks/useEnrichmentQueue";

interface NodeEnrichmentIndicatorProps {
  nodeId?: string;
  showTime?: boolean;
  size?: "sm" | "md" | "lg";
  loadingPapers?: boolean;
  loadingUseCases?: boolean;
}

export const NodeEnrichmentIndicator: React.FC<
  NodeEnrichmentIndicatorProps
> = ({
  nodeId,
  showTime = true,
  size = "sm",
  loadingPapers = false,
  loadingUseCases = false,
}) => {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSizeClass = size === "sm" ? "text-xs" : "text-sm";

  // Use queue system if nodeId is provided, otherwise fall back to legacy props
  const queueStatus = useEnrichmentQueue(nodeId || null);

  // Determine what to show based on queue status or legacy props
  const showQueueStatus = showTime;
  const actualLoadingPapers = showQueueStatus
    ? queueStatus.isPapersLoading
    : loadingPapers;
  const actualLoadingUseCases = showQueueStatus
    ? queueStatus.isUseCasesLoading
    : loadingUseCases;
  const isWaiting = showQueueStatus ? queueStatus.isWaiting : false;
  const hasError = showQueueStatus ? queueStatus.hasError : false;

  // Don't show anything if nothing is happening
  if (
    !actualLoadingPapers &&
    !actualLoadingUseCases &&
    !isWaiting &&
    !hasError
  ) {
    return null;
  }

  // Handle error states
  if (hasError) {
    return (
      <div className="flex items-center justify-center text-red-600">
        <AlertTriangle className={`mr-2 ${sizeClasses}`} />
        <span className={`${textSizeClass} font-semibold`}>取得失敗</span>
      </div>
    );
  }

  // Handle waiting state
  if (isWaiting && !actualLoadingPapers && !actualLoadingUseCases) {
    return (
      <div className="flex items-center justify-center text-yellow-600">
        <Clock className={`mr-2 ${sizeClasses}`} />
        <span className={`${textSizeClass} font-semibold`}>待機中</span>
      </div>
    );
  }

  // Build the loading message based on what's being loaded
  let loadingMessage = "";
  if (actualLoadingPapers && actualLoadingUseCases) {
    loadingMessage = "論文・事例を検索中";
  } else if (actualLoadingPapers) {
    loadingMessage = "論文を検索中";
  } else if (actualLoadingUseCases) {
    loadingMessage = "事例を検索中";
  } else {
    // This shouldn't happen, but fallback to general message
    loadingMessage = "データを検索中";
  }

  // Show elapsed time if available
  const elapsedTime = showQueueStatus
    ? actualLoadingPapers
      ? queueStatus.formatElapsedTime(queueStatus.papersElapsedTime)
      : actualLoadingUseCases
      ? queueStatus.formatElapsedTime(queueStatus.useCasesElapsedTime)
      : queueStatus.formatElapsedTime(queueStatus.useCasesElapsedTime)
    : queueStatus.formatElapsedTime(queueStatus.papersElapsedTime);

  return (
    <div className="flex items-center justify-center text-white">
      <Loader2 className={`animate-spin mr-2 ${sizeClasses}`} />
      <span className={`${textSizeClass} font-semibold`}>
        {loadingMessage}
        {<span className="ml-1 text-white">({elapsedTime})</span>}
      </span>
    </div>
  );
};
