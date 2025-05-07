
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

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

  // Parse the scenario to extract components for the template
  const extractScenarioComponents = (scenarioText: string) => {
    // Default values if we can't extract meaningful content
    const defaults = {
      what: "テクノロジーや研究トピック",
      whoTarget: "対象ユーザー",
      whoImplementer: "実施者",
      where: "実施環境",
      when: "条件や状況"
    };
    
    try {
      // Simple extraction based on common patterns in research scenarios
      // This is a basic implementation - could be enhanced with more sophisticated parsing
      const components = { ...defaults };
      
      // Extract WHAT (usually the main technology or concept at the start)
      const whatMatch = scenarioText.match(/^([^,\.]+)/);
      if (whatMatch) components.what = whatMatch[1].trim();
      
      // Look for WHO mentions (both target users and implementers)
      if (scenarioText.includes("専門家")) components.whoImplementer = "専門家";
      if (scenarioText.includes("研究者")) components.whoImplementer = "研究者";
      if (scenarioText.includes("技術者")) components.whoImplementer = "技術者";
      
      if (scenarioText.includes("患者")) components.whoTarget = "患者";
      if (scenarioText.includes("ユーザー")) components.whoTarget = "ユーザー";
      
      // Look for WHERE mentions (environments)
      if (scenarioText.includes("臨床環境")) components.where = "臨床環境";
      if (scenarioText.includes("研究所")) components.where = "研究所";
      if (scenarioText.includes("天文台")) components.where = "天文台";
      if (scenarioText.includes("病院")) components.where = "病院";
      
      // Look for WHEN mentions (conditions or situations)
      if (scenarioText.includes("早期発見")) components.when = "早期発見が必要な状況";
      if (scenarioText.includes("大気のゆらぎ")) components.when = "大気のゆらぎや光学的な歪みなどの状況";
      
      return components;
    } catch (e) {
      console.error("Error parsing scenario:", e);
      return defaults;
    }
  };

  const { what, whoTarget, whoImplementer, where, when } = extractScenarioComponents(scenario);

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">現在のシナリオ:</h2>
          <p className="text-gray-800 text-base mb-3">{scenario}</p>
        </div>
        <Button 
          variant="outline" 
          className="text-blue-600 border-blue-200 hover:bg-blue-100 h-8 w-8 p-0 flex items-center justify-center"
          onClick={handleEditScenario}
          title="シナリオを編集"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">シナリオを編集</span>
        </Button>
      </div>
    </div>
  );
};
