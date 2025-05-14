
import React from "react";
import { Button } from "@/components/ui/button";
import { ExplorationIcon } from "@/components/icons/ExplorationIcon";

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
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <ExplorationIcon className="text-gray-700" />
        研究シナリオを選択してください
      </h3>
      <p className="text-gray-700 mb-4">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください。
      </p>
      
      <div className="space-y-3">
        {generatedScenarios.map((scenario, index) => (
          <Button 
            key={index} 
            variant="outline"
            className={`w-full justify-start p-4 h-auto text-left ${
              selectedScenario === scenario 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800'
            }`}
            onClick={() => onScenarioSelect && onScenarioSelect(scenario)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {scenario}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
