
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";
import { BuildingScenario } from "./scenario-preview/BuildingScenario";
import { ScenarioList } from "./scenario-preview/ScenarioList";
import { ResearchAreas } from "./scenario-preview/ResearchAreas";
import { PreviewHeader } from "./scenario-preview/PreviewHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTreemapGeneration } from "@/hooks/research-context/useTreemapGeneration";

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
  const { treemapData, isGenerating, error, generateTreemap } = useTreemapGeneration();
  
  // Generate treemap when scenario is selected and we have a valid query
  useEffect(() => {
    if (selectedScenario && selectedScenario.trim() !== '' && initialQuery && initialQuery.trim() !== '') {
      console.log("Triggering treemap generation for scenario:", selectedScenario);
      console.log("With query:", initialQuery);
      generateTreemap(initialQuery, selectedScenario);
    }
  }, [selectedScenario, initialQuery, generateTreemap]);
  
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
          <BuildingScenario answers={answers} />

          {showScenarios && (
            <>
              <ScenarioList 
                generatedScenarios={generatedScenarios} 
                selectedScenario={selectedScenario} 
                onScenarioSelect={onScenarioSelect}
              />
              
              {selectedScenario && (
                <>
                  <Separator className="my-4" />
                  <ResearchAreas 
                    selectedScenario={selectedScenario}
                    researchAreasData={treemapData}
                    onGenerateResult={onGenerateResult!}
                    researchAreasRef={researchAreasRef}
                    isGenerating={isGenerating}
                    generationError={error}
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
