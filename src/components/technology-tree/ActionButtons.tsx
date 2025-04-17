
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-12">
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 text-lg font-medium"
        onClick={() => navigate("/search-results")}
      >
        View Research
      </Button>
    </div>
  );
};
