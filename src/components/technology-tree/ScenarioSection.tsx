
import React, { useEffect, useState } from 'react';
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
  const [parsedTemplate, setParsedTemplate] = useState("");

  // Extract 4W components from scenario text
  useEffect(() => {
    try {
      // Try to identify components from the scenario
      // This is a simple implementation and might need refinement based on actual scenario formats
      let what = scenario.includes("を") ? scenario.split("を")[0] + "を" : "[WHAT：]";
      
      let who1 = "[WHO：対象ユーザー]";
      let who2 = "[WHO：実施者]";
      let where = "[WHERE：環境]";
      let when = "[WHEN：条件や状況]";
      
      if (scenario.includes("対して")) {
        who1 = scenario.split("対して")[0].split("を")[1]?.trim() || who1;
        const afterWho1 = scenario.split("対して")[1];
        
        if (afterWho1.includes("が")) {
          who2 = afterWho1.split("が")[0]?.trim() || who2;
          const afterWho2 = afterWho1.split("が")[1];
          
          if (afterWho2.includes("で実施し")) {
            where = afterWho2.split("で実施し")[0]?.trim() || where;
            
            if (afterWho2.includes("によって") && afterWho2.includes("に対応")) {
              when = afterWho2.split("によって")[1]?.split("に対応")[0]?.trim() || when;
            }
          }
        }
      }

      // Build the template with extracted components
      const template = `${what} を ${who1} に対して ${who2} が ${where} で実施し、${what} によって ${when} に対応するものです。`;
      setParsedTemplate(template);
    } catch (e) {
      // If parsing fails, use the default template
      setParsedTemplate("[WHAT：] を [WHO：対象ユーザー] に対して [WHO：実施者] が [WHERE：環境] で実施し、[WHAT：] によって [WHEN：条件や状況] に対応するものです。");
    }
  }, [scenario]);

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
          <h2 className="text-sm font-medium text-blue-600 mb-1">現在のシナリオ:</h2>
          <p className="text-gray-800 text-base mb-2">{scenario}</p>
          <p className="text-gray-500 text-sm italic">{parsedTemplate}</p>
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
