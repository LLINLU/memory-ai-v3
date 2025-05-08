
import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
}

export const ScenarioSection = ({ 
  scenario = "網膜疾患を持つ医療専門家と患者が、早期発見のための非侵襲的診断方法を求める臨床環境",
  onEditScenario,
  conversationHistory = []
}: ScenarioSectionProps) => {
  const navigate = useNavigate();

  const handleEditScenario = () => {
    // Navigate to Research Context page with conversation history
    navigate('/research-context', { 
      state: { 
        editingScenario: true,
        currentScenario: scenario,
        savedConversationHistory: conversationHistory
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
          <h2 className="text-sm font-medium text-blue-600 mb-1">研究シナリオ:</h2>
          <p className="text-gray-800 text-base mb-3">{scenario}</p>
        </div>
        <button
          onClick={handleEditScenario}
          title="シナリオを編集"
          className="inline-flex items-center justify-center p-0 leading-none text-blue-600 border border-blue-200 hover:bg-blue-100 h-10 w-10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
          </svg>
          <span className="sr-only">シナリオを編集</span>
        </button>
      </div>
    </div>
  );
};
