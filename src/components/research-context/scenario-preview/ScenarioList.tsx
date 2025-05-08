
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
      
      {generatedScenarios.map((scenario, index) => (
        <div 
          key={index} 
          className={`mb-3 border rounded-md p-4 cursor-pointer transition-colors ${
            selectedScenario === scenario 
              ? 'bg-blue-50 border-blue-300' 
              : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`}
          onClick={() => onScenarioSelect && onScenarioSelect(scenario)}
        >
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className={selectedScenario === scenario ? "text-blue-700" : "text-gray-800"}>
                {scenario}
              </p>
              {selectedScenario === scenario ? (
                <div className="flex items-center gap-1 text-blue-600 text-sm mt-2">
                  <Check size={16} />
                  <span>選択済み</span>
                </div>
              ) : (
                <Button 
                  className="mt-3" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onScenarioSelect && onScenarioSelect(scenario);
                  }}
                >
                  このシナリオを選択
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
