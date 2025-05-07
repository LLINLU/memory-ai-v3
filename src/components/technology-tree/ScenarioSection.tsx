
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
}

export const ScenarioSection = ({ 
  scenario = "網膜疾患を持つ医療専門家と患者が、早期発見のための非侵襲的診断方法を求める臨床環境",
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

  // Format the template text
  const templateText = "[WHAT：] を [WHO：対象ユーザー] に対して [WHO：実施者] が [WHERE：環境] で実施し、[WHAT：] によって [WHEN：条件や状況] に対応するものです。";

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">現在のシナリオ:</h2>
          <p className="text-gray-800 text-base mb-2">{scenario}</p>
          <p className="text-gray-500 text-sm italic">{templateText}</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="text-blue-600 border-blue-200 hover:bg-blue-100"
          onClick={handleEditScenario}
          title="シナリオを編集"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">シナリオを編集</span>
        </Button>
      </div>
    </div>
  );
};
