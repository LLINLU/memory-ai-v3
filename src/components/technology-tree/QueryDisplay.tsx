
import React from "react";
import { useLocation } from "react-router-dom";

interface QueryDisplayProps {
  query?: string;
}

export const QueryDisplay = ({ query }: QueryDisplayProps) => {
  const location = useLocation();
  
  // Get searchMode from location state - if it's not defined or is "deep", show the section
  // 'quick' mode means user came directly from home page, hide the section
  // any other mode (e.g. "deep", undefined) means user came from research-context, show the section
  const searchMode = location.state?.searchMode;
  
  // If searchMode is "quick", don't render the component
  if (searchMode === "quick") {
    return null;
  }

  // Only render if query exists and is not empty
  if (!query || query.trim() === "") {
    return null;
  }

  return (
    <div className="bg-green-50 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-green-600 mb-1">
            検索クエリ：
          </h2>
          <p className="text-gray-800 text-base">{query}</p>
        </div>
      </div>
    </div>
  );
};
