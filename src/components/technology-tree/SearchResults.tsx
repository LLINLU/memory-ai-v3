
import React, { useEffect, useState } from "react";
import { PaperList } from "./PaperList";
import { useLocation } from "react-router-dom";

export const SearchResults = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  
  // Update to expose refresh function
  const refreshResults = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Effect to refresh the results when the path changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [location.pathname]);

  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]">
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <PaperList key={refreshKey} onRefresh={refreshResults} />
    </div>
  );
};
