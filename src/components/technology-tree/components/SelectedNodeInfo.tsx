
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
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-gray-700">{description}</p>}
    </div>
  );
};
