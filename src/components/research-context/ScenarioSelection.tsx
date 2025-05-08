
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ScenarioSelectionProps {
  scenarios: string[];
  onScenarioSelect: (scenario: string) => void;
  selectedScenario?: string;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ 
  scenarios, 
  onScenarioSelect,
  selectedScenario
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">研究シナリオを選択</h2>
      <p className="text-gray-700 mb-6">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください：
      </p>
      
      <RadioGroup 
        value={selectedScenario} 
        className="space-y-4"
        onValueChange={onScenarioSelect}
      >
        {scenarios.map((scenario, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer ${
              selectedScenario === scenario ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
            }`}
            onClick={() => onScenarioSelect(scenario)}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem 
                value={scenario} 
                id={`scenario-${index}`} 
                onClick={(e) => e.stopPropagation()}
              />
              <div>
                <label 
                  htmlFor={`scenario-${index}`} 
                  className="text-gray-800 cursor-pointer"
                >
                  {scenario}
                </label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
