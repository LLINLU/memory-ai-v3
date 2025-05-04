
import React from "react";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
}

export const SelectedNodeInfo = ({ title, description }: SelectedNodeInfoProps) => {
  if (!title) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {description && (
        <p className="text-gray-600 mb-4 max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
};
