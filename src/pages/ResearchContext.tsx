
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConversationDisplay } from "@/components/research-context/ConversationDisplay";
import { InputSection } from "@/components/research-context/InputSection";
import { InitialOptions } from "@/components/research-context/InitialOptions";
import { ScenarioSelection } from "@/components/research-context/ScenarioSelection";
import { ScenarioPreview } from "@/components/research-context/ScenarioPreview";
import { useResearchSteps } from "@/components/research-context/ResearchSteps";
import { useResearchContext } from "@/hooks/useResearchContext";
import { useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="container py-8 px-4 mx-auto max-w-5xl flex-1 flex flex-col h-screen">
                <div className="flex-1 flex flex-col">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-8">Research Context Builder</h1>
                    
                    {isEditingScenario && (
                      <div className="bg-blue-50 p-4 rounded-md mb-6">
                        <p className="text-blue-700">
                          You're editing your research scenario. Please select a new scenario below or create your own.
                        </p>
                      </div>
                    )}
                    
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
                        
                        {showScenarios && (
                          <ScenarioSelection 
                            scenarios={isEditingScenario ? 
                              [currentScenario, ...generatedScenarios.filter(s => s !== currentScenario).slice(0, 2)] : 
                              generatedScenarios}
                            onScenarioSelect={handleScenarioSelection}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-screen bg-gray-100 border-l border-gray-200">
                <ScenarioPreview
                  initialQuery={initialQuery}
                  answers={answers}
                  generatedScenarios={generatedScenarios}
                  selectedScenario={selectedScenario}
                  showScenarios={showScenarios}
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
