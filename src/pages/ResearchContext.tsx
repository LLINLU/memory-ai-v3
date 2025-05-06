
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConversationDisplay } from "@/components/research-context/ConversationDisplay";
import { InputSection } from "@/components/research-context/InputSection";
import { InitialOptions } from "@/components/research-context/InitialOptions";
import { ScenarioPreview } from "@/components/research-context/ScenarioPreview";
import { useResearchSteps } from "@/components/research-context/ResearchSteps";
import { useResearchContext } from "@/hooks/useResearchContext";
import { useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const ResearchContext = () => {
  const location = useLocation();
  
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
    handleEditUserReply
  } = useResearchContext(initialQuery, steps);

  // If user is redirected to edit scenario, show scenario selection right away
  useEffect(() => {
    if (isEditingScenario && currentScenario) {
      // Skip the conversation and go straight to scenario selection
      proceedToScenarios();
    }
  }, [isEditingScenario, currentScenario, proceedToScenarios]);

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="flex flex-col h-full p-4">
                <div className="flex-none">
                  <h1 className="text-2xl font-bold mb-4">Research Context Builder</h1>
                  
                  {isEditingScenario && (
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-blue-700">
                        You're editing your research scenario. Please select a new scenario in the preview panel.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    {showInitialOptions && !isEditingScenario ? (
                      <InitialOptions 
                        initialQuery={initialQuery}
                        onContinue={() => handleInitialOption('continue')}
                        onSkip={() => handleInitialOption('skip')}
                      />
                    ) : (
                      <>
                        {!isEditingScenario && (
                          <ConversationDisplay 
                            conversationHistory={conversationHistory} 
                            onEditReply={handleEditUserReply}
                          />
                        )}
                        
                        {showScenarios && (
                          <div className="mt-6">
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h2 className="text-xl font-semibold mb-2">Research Scenario Ready</h2>
                              <p className="text-blue-700">
                                Based on your responses, we've generated research scenarios for you.
                                Please select a scenario from the preview panel on the right.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </ScrollArea>
                </div>
                
                <div className="flex-none">
                  {currentStep < steps.length && !showScenarios && !isEditingScenario && (
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

            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full bg-gray-100 border-l border-gray-200">
                <ScenarioPreview
                  initialQuery={initialQuery}
                  answers={answers}
                  generatedScenarios={generatedScenarios}
                  selectedScenario={selectedScenario}
                  showScenarios={showScenarios}
                  onScenarioSelect={handleScenarioSelection}
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
