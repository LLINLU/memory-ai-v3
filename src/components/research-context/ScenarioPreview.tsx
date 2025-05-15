
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";
import { BuildingScenario } from "./scenario-preview/BuildingScenario";
import { ScenarioList } from "./scenario-preview/ScenarioList";
import { ResearchAreas } from "./scenario-preview/ResearchAreas";
import { PreviewHeader } from "./scenario-preview/PreviewHeader";
import { researchAreasData } from "./scenario-preview/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  isResearchAreaVisible?: boolean;
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
  onGenerateResult,
  isResearchAreaVisible
}) => {
  const hasAnswers = Object.values(answers).some(answer => answer.trim() !== '');
  
  return (
    <div className="flex flex-col h-full">
      <PreviewHeader 
        showGenerateButton={showGenerateButton}
        isResearchAreaVisible={isResearchAreaVisible}
        onGenerateResult={onGenerateResult}
        selectedScenario={selectedScenario}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Building Your Scenario Section */}
          <BuildingScenario answers={answers} />

          {/* Suggested Scenarios Section */}
          {showScenarios && (
            <>
              <ScenarioList 
                generatedScenarios={generatedScenarios} 
                selectedScenario={selectedScenario} 
              />
              
              {selectedScenario && (
                <>
                  <Separator className="my-4" />
                  <ResearchAreas 
                    selectedScenario={selectedScenario}
                    researchAreasData={researchAreasData}
                    onGenerateResult={onGenerateResult!}
                    researchAreasRef={researchAreasRef}
                  />
                </>
              )}
            </>
          )}
          
          {!hasAnswers && !showScenarios && (
            <div className="flex items-center justify-center h-40 text-gray-500">
              質問に答えて研究コンテキストを構築しましょう
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
