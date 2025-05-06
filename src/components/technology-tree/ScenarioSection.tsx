
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
}

export const ScenarioSection = ({ 
  scenario = "Medical professionals and patients with retinal disorders in clinical settings seeking non-invasive diagnostic methods for early detection of conditions",
  onEditScenario 
}: ScenarioSectionProps) => {
  const navigate = useNavigate();

  const handleEditScenario = () => {
    // Navigate to Research Context page instead of showing modal
    navigate('/research-context', { 
      state: { 
        editingScenario: true,
        currentScenario: scenario
      } 
    });
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
          size="icon" 
          className="text-blue-600 border-blue-200 hover:bg-blue-100"
          onClick={handleEditScenario}
          title="Edit Scenario"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Scenario</span>
        </Button>
      </div>
    </div>
  );
};
