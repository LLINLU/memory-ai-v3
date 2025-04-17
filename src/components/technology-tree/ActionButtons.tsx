
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-12">
      <Button
        variant="outline"
        className="border-2 border-gray-300 text-blue-500 py-6 px-8 text-lg font-medium"
        onClick={() => navigate("/search-results")}
      >
        Show All Results
      </Button>
      
      <Button
        variant="outline"
        className="border-2 border-gray-300 text-blue-500 py-6 px-8 text-lg font-medium"
      >
        Export Technology Map
      </Button>
      
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 text-lg font-medium"
        onClick={() => navigate("/search-results")}
      >
        View Research
      </Button>
    </div>
  );
};
