
import React, { useState } from "react";

interface ScenarioSelectionProps {
  scenarios: string[];
  selectedScenario?: string;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ 
  scenarios, 
  selectedScenario
}) => {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">研究シナリオを選択</h2>
      <p className="text-gray-700 mb-6">
        ご回答に基づき、以下の研究シナリオを生成しました。
        ご関心に最も近いものをお選びください：
      </p>
      
      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <button 
            key={index}
            type="button"
            className={`w-full border rounded-lg p-4 transition-colors duration-200 text-left
              ${selectedScenario === scenario ? 'bg-blue-50 border-blue-300' : ''}
              ${hoveredScenario === scenario && selectedScenario !== scenario ? 'border-blue-300 bg-blue-50' : selectedScenario !== scenario ? 'border-gray-200' : ''}
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
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-primary flex-shrink-0 mt-1">
                {selectedScenario === scenario && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                )}
              </div>
              <div>
                <span className="text-gray-800">{scenario}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
