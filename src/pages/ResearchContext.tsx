
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConversationDisplay } from "@/components/research-context/ConversationDisplay";
import { InputSection } from "@/components/research-context/InputSection";
import { InitialOptions } from "@/components/research-context/InitialOptions";
import { ScenarioPreview } from "@/components/research-context/ScenarioPreview";
import { useResearchSteps } from "@/components/research-context/ResearchSteps";
import { useResearchContext } from "@/hooks/useResearchContext";
import { useEffect, useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const ResearchContext = () => {
  const location = useLocation();
  const scenarioMessageRef = useRef<HTMLDivElement>(null);
  
  // Get the query from location state (passed from homepage)
  const locationState = location.state as { 
    query?: string, 
    editingScenario?: boolean,
    currentScenario?: string 
  } || {};
  
  const initialQuery = locationState.query || "";
  const isEditingScenario = locationState.editingScenario || false;
  const currentScenario = locationState.currentScenario || "";
  
  // Get steps and research context logic
  const steps = useResearchSteps();
  const {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    selectedScenario,
    handleInitialOption,
    handleInputChange,
    handleSubmit,
    handleSkip,
    handleScenarioSelection,
    proceedToScenarios,
    setShowScenarios,
    handleEditUserReply,
    handleReset,
    handleGenerateResult,
    researchAreasRef,
    shouldShowInputSection,
    isEditingScenario: isEditing
  } = useResearchContext(initialQuery, steps, isEditingScenario, currentScenario);

  // Determine when to show the generate button
  // Show it when we're not in initial state (either in conversation or showing scenarios)
  const showGenerateButton = !showInitialOptions || showScenarios || isEditingScenario;

  // Scroll to the scenario message when it becomes visible
  useEffect(() => {
    if (showScenarios && scenarioMessageRef.current) {
      setTimeout(() => {
        scenarioMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [showScenarios]);
  
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="flex flex-col h-full px-8 py-4">
                <div className="flex-none flex justify-between items-center mb-4">
                  <h1 className="text-[1.2rem] font-bold">研究背景を整理します</h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex items-center gap-1"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    リセット
                  </Button>
                </div>
                
                {isEditingScenario && (
                  <div className="flex-none bg-blue-50 p-3 rounded-md mb-4">
                    <p className="text-blue-700">
                      研究シナリオを編集しています。プレビューパネルから新しいシナリオを選択してください。
                    </p>
                  </div>
                )}
                
                {/* Main content area with flex grow to fill available space */}
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                  {/* Conditional render based on initial options or conversation */}
                  {showInitialOptions && !isEditingScenario ? (
                    <InitialOptions 
                      initialQuery={initialQuery}
                      onContinue={() => handleInitialOption('continue')}
                      onSkip={() => handleInitialOption('skip')}
                    />
                  ) : (
                    <div className="flex flex-col h-full relative">
                      {/* Scrollable conversation area - takes available space */}
                      {!isEditingScenario && (
                        <div className="flex-grow overflow-hidden mb-4">
                          <ScrollArea className="h-full pr-4">
                            <ConversationDisplay 
                              conversationHistory={conversationHistory} 
                              onEditReply={handleEditUserReply}
                            />
                          </ScrollArea>
                        </div>
                      )}
                      
                      {/* Scenario message - positioned at bottom above input */}
                      {showScenarios && !isEditingScenario && (
                        <div className="mb-4" ref={scenarioMessageRef}>
                          <div className="bg-blue-50 p-4 rounded-md">
                            <h2 className="text-xl font-semibold mb-2">研究シナリオの準備完了</h2>
                            <p className="text-blue-700">
                              ご回答に基づき、研究シナリオを生成しました。
                              右側のプレビューパネルからシナリオを選択してください。
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Input section always at bottom */}
                      {(!showInitialOptions || shouldShowInputSection) && !isEditingScenario && (
                        <div className="mt-auto">
                          <InputSection
                            inputValue={inputValue}
                            placeholder={steps[Math.min(currentStep, steps.length - 1)]?.placeholder}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                            onSkip={handleSkip}
                            showSkip={currentStep < steps.length}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full bg-gray-100 border-l border-gray-200">
                <ScenarioPreview
                  initialQuery={initialQuery}
                  answers={answers}
                  generatedScenarios={generatedScenarios}
                  selectedScenario={selectedScenario}
                  showScenarios={showScenarios || isEditingScenario}
                  showGenerateButton={showGenerateButton}
                  onScenarioSelect={handleScenarioSelection}
                  researchAreasRef={researchAreasRef}
                  onGenerateResult={handleGenerateResult}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResearchContext;
