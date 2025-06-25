
import React from "react";

interface SelectedNodeInfoProps {
  title?: string;
  description?: string;
  parentTitles?: string[];
}

export const SelectedNodeInfo = ({ 
  title, 
  description,
  parentTitles 
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
        <p className="text-gray-700 mb-3" style={{ fontSize: '14px', maxWidth: '80%' }}>
          {description}
        </p>
      )}
      {parentTitles && parentTitles.length > 0 && (
        <div className="border-t pt-3 mt-3">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Parent Hierarchy:</h4>
          <div className="space-y-1">
            {parentTitles.map((parentTitle, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <span className="text-xs text-gray-400 mr-2">L{index + 1}</span>
                <span className="truncate">{parentTitle}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
