
import React from "react";
import { TimeIcon } from "@/components/icons/TimeIcon";

interface ScenarioListProps {
  generatedScenarios: string[];
  selectedScenario?: string;
  onScenarioSelect?: (scenario: string) => void;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  generatedScenarios,
  selectedScenario
}) => {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <TimeIcon className="text-gray-700" />
        研究シナリオを選択してください
      </h3>
      <p className="text-gray-700 mb-4">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください。
      </p>
      
      <div className="space-y-3">
        {generatedScenarios.map((scenario, index) => (
          <div 
            key={index} 
            className={`w-full justify-start p-4 h-auto text-left rounded-md ${
              selectedScenario === scenario 
                ? 'bg-blue-50 border border-blue-300 text-blue-700' 
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
            aria-selected={selectedScenario === scenario}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {scenario}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
