
import React, { useState } from "react";
import { TimeIcon } from "@/components/icons/TimeIcon";

interface ScenarioListProps {
  generatedScenarios: string[];
  selectedScenario?: string;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  generatedScenarios,
  selectedScenario: initialSelectedScenario
}) => {
  const [hoveredScenario, setHoveredScenario] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(initialSelectedScenario);

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
            className={`w-full justify-start p-4 h-auto text-left rounded-md cursor-pointer transition-colors ${
              selectedScenario === scenario 
                ? 'bg-blue-50 border border-blue-300 text-blue-700' 
                : hoveredScenario === index
                ? 'bg-gray-50 border border-gray-300 text-gray-800'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
            onMouseEnter={() => setHoveredScenario(index)}
            onMouseLeave={() => setHoveredScenario(null)}
            onClick={() => setSelectedScenario(scenario)}
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
