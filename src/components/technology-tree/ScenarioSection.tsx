
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: () => void;
}

export const ScenarioSection = ({ 
  scenario = "Medical professionals and patients with retinal disorders in clinical settings seeking non-invasive diagnostic methods for early detection of conditions",
  onEditScenario 
}: ScenarioSectionProps) => {
  const navigate = useNavigate();
  
  const handleEditScenario = () => {
    if (onEditScenario) {
      onEditScenario();
    } else {
      // Use direct navigation with state to ensure it works consistently
      navigate('/research-context', { 
        state: { 
          editingScenario: true,
          scenario: scenario // Pass the current scenario back to the research context
        },
        replace: true // Use replace to prevent back button issues
      });
    }
  };
  
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">Current Scenario:</h2>
          <p className="text-gray-800 text-base">{scenario}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 border-blue-200 hover:bg-blue-100"
          onClick={handleEditScenario}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Scenario
        </Button>
      </div>
    </div>
  );
};
