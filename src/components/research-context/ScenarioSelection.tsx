
import React from "react";
import { Button } from "@/components/ui/button";

interface ScenarioSelectionProps {
  scenarios: string[];
  onScenarioSelect: (scenario: string) => void;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ 
  scenarios, 
  onScenarioSelect 
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">研究シナリオを選択</h2>
      <p className="text-gray-700 mb-6">
        あなたの回答に基づいて、以下の研究シナリオを生成しました。
        興味に最も合うものを選択してください：
      </p>
      
      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => onScenarioSelect(scenario)}
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <p className="text-gray-800">{scenario}</p>
                <Button 
                  className="mt-3" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onScenarioSelect(scenario);
                  }}
                >
                  このシナリオを選択
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
