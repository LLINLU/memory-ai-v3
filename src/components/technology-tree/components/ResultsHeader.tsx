
import React from "react";
import { FilterSort } from "../FilterSort";

export const ResultsHeader = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm text-gray-600">32 papers • 9 implementations</span>
      <FilterSort className="justify-end" />
    </div>
  );
};
