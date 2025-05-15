
import React from "react";

interface ScenarioSelectionProps {
  scenarios: string[];
  onScenarioSelect: (scenario: string) => void;
  selectedScenario?: string;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ 
  scenarios, 
  selectedScenario
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">研究シナリオを選択</h2>
      <p className="text-gray-700 mb-6">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください：
      </p>
      
      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 ${
              selectedScenario === scenario ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 rounded-full border border-primary flex-shrink-0 mt-1">
                {selectedScenario === scenario && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary m-[3px]"></div>
                )}
              </div>
              <div>
                <span className="text-gray-800">
                  {scenario}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
