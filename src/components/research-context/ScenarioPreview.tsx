
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";
import { Button } from "@/components/ui/button";

interface ScenarioPreviewProps {
  initialQuery: string;
  answers: ContextAnswers;
  generatedScenarios: string[];
  selectedScenario?: string;
  showScenarios: boolean;
  showGenerateButton: boolean;
  onScenarioSelect?: (scenario: string) => void;
  researchAreasRef?: React.RefObject<HTMLDivElement>;
  onGenerateResult?: () => void;
}

export const ScenarioPreview: React.FC<ScenarioPreviewProps> = ({
  initialQuery,
  answers,
  generatedScenarios,
  selectedScenario,
  showScenarios,
  showGenerateButton,
  onScenarioSelect,
  researchAreasRef,
  onGenerateResult
}) => {
  const hasAnswers = Object.values(answers).some(answer => answer.trim() !== '');
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <h2 className="text-[1rem] font-bold">プレビュー</h2>
        {showGenerateButton && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onGenerateResult}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Generate Search Result
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Building Your Scenario Section */}
        <Card className="bg-blue-50 border-blue-100">
          <div className="p-4">
            <h3 className="text-blue-700 font-semibold mb-3">シナリオの構築</h3>
            
            <div className="space-y-2">
              <div className="flex">
                <span className="text-gray-500 w-16">Who:</span>
                <span className="text-gray-800 text-[14px]">{answers.who || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">What:</span>
                <span className="text-gray-800 text-[14px]">{answers.what || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">Where:</span>
                <span className="text-gray-800 text-[14px]">{answers.where || '...'}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 w-16">When:</span>
                <span className="text-gray-800 text-[14px]">{answers.when || '...'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Suggested Scenarios Section */}
        {showScenarios && (
          <>
            <div>
              <h3 className="text-xl font-semibold mb-3">Choose a Research Scenario</h3>
              <p className="text-gray-700 mb-4">
                Based on your responses, we've generated the following research scenarios. 
                Please select the one that best matches your interest:
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
                          <span>Selected</span>
                        </div>
                      ) : (
                        <Button 
                          className="mt-3" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onScenarioSelect && onScenarioSelect(scenario);
                          }}
                        >
                          Select This Scenario
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedScenario && (
              <div>
                <Separator className="my-4" />
                <div className="bg-white border rounded-md p-4" ref={researchAreasRef}>
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
            質問に答えて研究コンテキストを構築しましょう
          </div>
        )}
      </div>
    </div>
  );
};
