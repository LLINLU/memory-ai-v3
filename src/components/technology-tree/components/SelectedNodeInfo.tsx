
import React from "react";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
}

export const SelectedNodeInfo: React.FC<SelectedNodeInfoProps> = ({ title, description }) => {
  if (!title) {
    return (
      <div className="mt-2 mb-4">
        <p className="text-sm text-gray-500">Select a node to view its details</p>
      </div>
    );
  }
  
  return (
    <div className="mt-2 mb-4">
      {/* Title removed to avoid duplication with the header */}
      {description && (
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      )}
    </div>
  );
};
