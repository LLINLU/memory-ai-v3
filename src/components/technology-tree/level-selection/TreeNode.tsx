import React, { useRef, useEffect, useState } from "react";
import { NodeActions } from "./node-components/NodeActions";
import { NodeContent } from "./node-components/NodeContent";
import { getNodeStyle } from "./node-utils/nodeStyles";
import { TreeNode as TreeNodeType } from "@/types/tree";
import { Loader2 } from "lucide-react";
import {
  isNodeLoading,
  isPapersLoading,
  isUseCasesLoading,
} from "@/services/nodeEnrichmentService";
import {
  isLevel1Loading,
  isLevel1PapersLoading,
  isLevel1UseCasesLoading,
} from "@/hooks/useLevel1EnrichmentPolling";
import { NodeEnrichmentIndicator } from "./node-components/NodeEnrichmentIndicator";
import { useEnrichmentQueue } from "@/hooks/useEnrichmentQueue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TreeNodeProps {
  item: TreeNodeType;
  isSelected: boolean;
  onClick: () => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onAddClick: (e: React.MouseEvent) => void;
  onAiAssistClick: (e: React.MouseEvent) => void;
  level?: number;
  showDescription?: boolean;
  subNodeCount?: number;
  isLastLevel?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  isSelected,
  onClick,
  onEditClick,
  onDeleteClick,
  onAddClick,
  onAiAssistClick,
  level,
  showDescription = false,
  subNodeCount = 0,
  isLastLevel = false,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeWidth, setNodeWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Update width on mount and window resize
    const updateWidth = () => {
      if (nodeRef.current) {
        setNodeWidth(nodeRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const nodeStyleClass = getNodeStyle(item, isSelected, level);
  // Force white text for selected nodes to ensure visibility
  const descriptionTextColor = isSelected ? "text-gray-100" : "text-gray-600";
  // Check if this node is being enriched
  const isEnriching = isNodeLoading(item.id);

  // For level 1 nodes (scenarios), use the new level 1 enrichment polling
  // For other levels, use the existing individual node enrichment
  const isLevel1Node = level === 1;

  // Get queue status for this node
  const queueStatus = useEnrichmentQueue(item.id);

  let loadingPapers: boolean;
  let loadingUseCases: boolean;

  if (isLevel1Node) {
    // Level 1 nodes use the new polling system
    loadingPapers = isLevel1PapersLoading(item.id);
    loadingUseCases = isLevel1UseCasesLoading(item.id);

    // Always check the node's info string for the true counts
    // The info string contains the actual counts from the database converter
    let infoPaperCount = 0;
    let infoUseCaseCount = 0;

    if (item.info) {
      const infoMatch = item.info.match(/(\d+)論文・(\d+)事例/);
      if (infoMatch) {
        infoPaperCount = parseInt(infoMatch[1]);
        infoUseCaseCount = parseInt(infoMatch[2]);
      }
    }

    // If polling system says not loading but info shows 0 counts, override to show loading
    // This handles the case where polling hasn't initialized yet or missed updates
    if (!loadingPapers && infoPaperCount === 0) {
      loadingPapers = true;
      console.log(
        `[TREE_NODE] Override: forcing papers loading for ${item.id} (info shows 0 papers)`
      );
    }

    if (!loadingUseCases && infoUseCaseCount === 0) {
      loadingUseCases = true;
      console.log(
        `[TREE_NODE] Override: forcing use cases loading for ${item.id} (info shows 0 use cases)`
      );
    }

    // If polling system says loading but info shows >0 counts, override to stop loading
    // This handles the case where polling system hasn't updated yet but data is available
    if (loadingPapers && infoPaperCount > 0) {
      loadingPapers = false;
      console.log(
        `[TREE_NODE] Override: stopping papers loading for ${item.id} (info shows ${infoPaperCount} papers)`
      );
    }

    if (loadingUseCases && infoUseCaseCount > 0) {
      loadingUseCases = false;
      console.log(
        `[TREE_NODE] Override: stopping use cases loading for ${item.id} (info shows ${infoUseCaseCount} use cases)`
      );
    }

    console.log(
      `[TREE_NODE] Level 1 node ${item.id} (${item.name}): loadingPapers=${loadingPapers}, loadingUseCases=${loadingUseCases}, info="${item.info}" (${infoPaperCount} papers, ${infoUseCaseCount} use cases)`
    );
  } else {
    // Other levels use the existing individual enrichment system
    loadingPapers = isPapersLoading(item.id);
    loadingUseCases = isUseCasesLoading(item.id);
  }

  // Also consider queue status for any level
  const hasQueueActivity =
    queueStatus.isLoading || queueStatus.isWaiting || queueStatus.hasError;

  // Show enrichment indicator if either papers or use cases are loading, or there's queue activity
  const showEnrichmentIndicator =
    loadingPapers || loadingUseCases || hasQueueActivity;

  // Determine if tooltip should be shown
  const shouldShowTooltip = !isSelected && !isLastLevel && subNodeCount > 0;

  const nodeContent = (
    <div
      ref={nodeRef}
      className={`
        py-4 px-4 rounded-lg cursor-pointer transition-all relative
        min-w-[200px] w-full
        ${nodeStyleClass}
        group
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col relative z-10 min-w-0">
        <NodeContent
          item={item}
          isSelected={isSelected}
          isHovered={isHovered}
          level={level}
        />
        {/* Show description when showDescription is true */}
        {showDescription && item.description && (
          <div
            className={`mt-3 text-sm ${descriptionTextColor} border-t pt-2 border-gray-100 overflow-hidden`}
          >
            {item.description}
          </div>
        )}{" "}
        {/* Show enrichment loading indicator */}
        {
          <div className="mt-2">
            <NodeEnrichmentIndicator
              nodeId={item.id}
              size="sm"
              loadingPapers={loadingPapers}
              loadingUseCases={loadingUseCases}
            />
          </div>
        }
        {/* Show actions when hovered - positioned to not affect width */}
        {isHovered && (
          <div className="mt-2 flex justify-end">
            <NodeActions
              itemName={item.name}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onAddClick={onAddClick}
              onAiAssistClick={onAiAssistClick}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with tooltip if conditions are met
  if (shouldShowTooltip) {
    return (
      <TooltipProvider delayDuration={50} skipDelayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>{nodeContent}</TooltipTrigger>
          <TooltipContent>
            <p>サブカテゴリが{subNodeCount}つあります。クリックで表示。</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return nodeContent;
};
