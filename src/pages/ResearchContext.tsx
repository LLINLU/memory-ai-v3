
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConversationDisplay } from "@/components/research-context/ConversationDisplay";
import { InputSection } from "@/components/research-context/InputSection";
import { InitialOptions } from "@/components/research-context/InitialOptions";
import { ScenarioPreview } from "@/components/research-context/ScenarioPreview";
import { useResearchSteps } from "@/components/research-context/ResearchSteps";
import { useResearchContext } from "@/hooks/useResearchContext";
import { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const ResearchContext = () => {
  const location = useLocation();
  const [isResearchAreaVisible, setIsResearchAreaVisible] = useState(false);
  
  // Get the query and conversation history from location state (passed from technology-tree page)
  const locationState = location.state as { 
    query?: string, 
    editingScenario?: boolean,
    currentScenario?: string,
    savedConversationHistory?: any[]
  } || {};
  
  const initialQuery = locationState.query || "";
  const editingFromState = locationState.editingScenario || false;
  const currentScenario = locationState.currentScenario || "";
  const savedConversationHistory = locationState.savedConversationHistory || [];
  
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
    isEditingScenario,
    initializeSavedHistory
  } = useResearchContext(initialQuery, steps, editingFromState, currentScenario, savedConversationHistory);

  // Determine when to show the generate button
  // Show it when we're not in initial state (either in conversation or showing scenarios)
  const showGenerateButton = !showInitialOptions || showScenarios || isEditingScenario;
  
  // Initialize conversation history if editing from technology tree
  useEffect(() => {
    if (isEditingScenario && savedConversationHistory && savedConversationHistory.length > 0) {
      initializeSavedHistory(savedConversationHistory);
    }
  }, [isEditingScenario, savedConversationHistory, initializeSavedHistory]);
  
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={40}>
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
                
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Use the fixed-height scroll area with proper overflow behavior */}
                  <ScrollArea className="flex-1 overflow-y-auto" style={{ display: 'block' }}>
                    <div className="px-3 py-4" style={{ minHeight: '100%' }}>
                      {showInitialOptions && !isEditingScenario ? (
                        <InitialOptions 
                          initialQuery={initialQuery}
                          onContinue={() => handleInitialOption('continue')}
                          onSkip={() => handleInitialOption('skip')}
                        />
                      ) : (
                        <>
                          {/* Show conversation history even when editing scenario */}
                          <ConversationDisplay 
                            conversationHistory={conversationHistory} 
                            onEditReply={handleEditUserReply}
                            onResearchAreaVisible={setIsResearchAreaVisible}
                          />
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex-none mt-4">
                  {shouldShowInputSection && (
                    <InputSection
                      inputValue={inputValue}
                      placeholder={steps[currentStep]?.placeholder}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      onSkip={handleSkip}
                      showSkip={true}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50} minSize={25}>
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
                  isResearchAreaVisible={isResearchAreaVisible}
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
