
import React, { useState } from "react";
import { TimeIcon } from "@/components/icons/TimeIcon";

interface ScenarioListProps {
  generatedScenarios: string[];
  selectedScenario?: string;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  generatedScenarios,
  selectedScenario,
}) => {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

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
          <button 
            key={index} 
            type="button"
            className={`w-full justify-start p-4 h-auto text-left rounded-md border transition-colors duration-200
              ${selectedScenario === scenario 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : hoveredScenario === scenario
                  ? 'border-blue-300 bg-blue-50 text-gray-800'
                  : 'bg-white border-gray-200 text-gray-800'
              }
              ${activeScenario === scenario ? 'ring-2 ring-blue-300' : ''}
            `}
            onMouseEnter={() => setHoveredScenario(scenario)}
            onMouseLeave={() => setHoveredScenario(null)}
            onMouseDown={() => setActiveScenario(scenario)}
            onMouseUp={() => setActiveScenario(null)}
            onBlur={() => {
              setHoveredScenario(null);
              setActiveScenario(null);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {scenario}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
