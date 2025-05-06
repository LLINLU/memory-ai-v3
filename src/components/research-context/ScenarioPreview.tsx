
import React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";

interface ScenarioPreviewProps {
  initialQuery: string;
  answers: ContextAnswers;
  generatedScenarios: string[];
  selectedScenario?: string;
  showScenarios: boolean;
}

export const ScenarioPreview: React.FC<ScenarioPreviewProps> = ({
  initialQuery,
  answers,
  generatedScenarios,
  selectedScenario,
  showScenarios
}) => {
  const hasAnswers = Object.values(answers).some(answer => answer.trim() !== '');
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b">
        <h2 className="text-xl font-bold">Preview</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Building Your Scenario Section */}
        <Card className="bg-blue-50 border-blue-100">
          <div className="p-4">
            <h3 className="text-blue-700 font-semibold mb-3">Building Your Scenario</h3>
            
            <div className="space-y-2">
              <div className="flex">
                <span className="text-gray-500 w-16">Who:</span>
                <span className="text-gray-800">{answers.who || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">What:</span>
                <span className="text-gray-800">{answers.what || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">Where:</span>
                <span className="text-gray-800">{answers.where || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">When:</span>
                <span className="text-gray-800">{answers.when || '...'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Suggested Scenarios Section */}
        {showScenarios && (
          <>
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Suggested scenarios</h3>
              
              {generatedScenarios.map((scenario, index) => (
                <div key={index} className="mb-2">
                  <div 
                    className={`rounded-md p-3 border ${
                      selectedScenario === scenario 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {selectedScenario === scenario && (
                      <div className="flex items-center gap-2 mb-1">
                        <Check size={16} className="text-blue-600" />
                        <span className="text-blue-600 text-sm font-medium">Selected</span>
                      </div>
                    )}
                    <p className={selectedScenario === scenario ? "text-blue-800" : "text-gray-700"}>
                      {scenario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedScenario && (
              <div>
                <Separator className="my-4" />
                <div className="bg-white border rounded-md p-4">
                  <h3 className="font-medium mb-3">Potential Research Areas</h3>
                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Based on your selection:</p>
                    <p className="text-blue-700">{selectedScenario}</p>
                  </div>
                  
                  {/* Placeholder for research areas visualization */}
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                    <p className="text-gray-500">Research areas visualization</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span>Retinal Imaging (42 papers)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span>Wavefront Sensing (28 papers)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                      <span>Clinical Applications (18 papers)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                      <span>Other Areas (12 papers)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {!hasAnswers && !showScenarios && (
          <div className="flex items-center justify-center h-40 text-gray-500">
            Complete the questions to build your research context
          </div>
        )}
      </div>
    </div>
  );
};
