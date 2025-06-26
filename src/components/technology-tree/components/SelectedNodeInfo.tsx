import React from "react";

import { NodeInfo } from "@/services/nodeEnrichmentService.ts";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
  parentNodes?: NodeInfo[];
}

export const SelectedNodeInfo = ({
  title,
  description,
  parentNodes,
}: SelectedNodeInfoProps) => {
  if (!title && !description) {
    return null;
  }

  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p
          className="text-gray-700 mb-3"
          style={{ fontSize: "14px", maxWidth: "80%" }}
        >
          {description}
        </p>
      )}
      {parentNodes && parentNodes.length > 0 && (
        <div className="border-t pt-3 mt-3">
          <h4 className="text-sm font-medium text-gray-800 mb-2"></h4>
          <div className="space-y-2">
            {parentNodes.map((parentNode) => (
              <div
                key={`${title}-${parentNode.name}`}
                className="flex items-center text-sm text-gray-600"
              >
                <span className="text-xs text-gray-400 mr-4 max-w-8">
                  {parentNode.level}
                </span>
                <span>{parentNode.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
