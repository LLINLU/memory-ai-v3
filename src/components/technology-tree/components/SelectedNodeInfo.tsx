
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
      {description && <p className="text-gray-700" style={{ fontSize: '14px', maxWidth: '80%' }}>{description}</p>}
    </div>
  );
};
