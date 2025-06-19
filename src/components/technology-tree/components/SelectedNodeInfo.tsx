
import React from "react";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
}

export const SelectedNodeInfo = ({ 
  title, 
  description 
}: SelectedNodeInfoProps) => {
  if (!title && !description) {
    return null;
  }
  
  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-700" style={{ fontSize: '14px', maxWidth: '80%' }}>
          {description}
        </p>
      )}
    </div>
  );
};
