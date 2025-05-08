
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ScenarioListProps {
  generatedScenarios: string[];
  selectedScenario?: string;
  onScenarioSelect?: (scenario: string) => void;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  generatedScenarios,
  selectedScenario,
  onScenarioSelect
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">研究シナリオを選択してください</h3>
      <p className="text-gray-700 mb-4">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください。
      </p>
      
      <RadioGroup value={selectedScenario} className="space-y-3">
        {generatedScenarios.map((scenario, index) => (
          <div 
            key={index} 
            className={`border rounded-md p-4 cursor-pointer transition-colors ${
              selectedScenario === scenario 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => onScenarioSelect && onScenarioSelect(scenario)}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem 
                value={scenario} 
                id={`scenario-${index}`} 
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor={`scenario-${index}`}
                  className={`text-sm sm:text-base cursor-pointer block ${selectedScenario === scenario ? 'text-blue-700' : 'text-gray-800'}`}
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
