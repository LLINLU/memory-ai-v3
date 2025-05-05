
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConversationDisplay } from "@/components/research-context/ConversationDisplay";
import { InputSection } from "@/components/research-context/InputSection";
import { InitialOptions } from "@/components/research-context/InitialOptions";
import { ScenarioSelection } from "@/components/research-context/ScenarioSelection";
import { useResearchSteps } from "@/components/research-context/ResearchSteps";
import { useResearchContext } from "@/hooks/useResearchContext";
import { useEffect } from "react";

const ResearchContext = () => {
  const location = useLocation();
  
  // Get the query and editingScenario flag from location state
  const locationState = location.state as { 
    query?: string;
    editingScenario?: boolean;
    scenario?: string; // Added to handle the passed scenario
  } || {};

  const initialQuery = locationState.query || "";
  const isEditingScenario = locationState.editingScenario || false;
  const passedScenario = locationState.scenario || "";
  
  // Get steps and research context logic
  const steps = useResearchSteps();
  const {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    currentStep,
    inputValue,
    conversationHistory,
    handleInitialOption,
    handleInputChange,
    handleSubmit,
    handleSkip,
    handleScenarioSelection,
    loadStoredConversation
  } = useResearchContext(initialQuery, steps);

  // Load previous conversation if editing scenario
  useEffect(() => {
    if (isEditingScenario) {
      console.log("Loading stored conversation for editing scenario");
      loadStoredConversation(passedScenario);
    }
  }, [isEditingScenario, loadStoredConversation, passedScenario]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="container py-8 px-4 mx-auto max-w-5xl flex-1 flex flex-col">
            <div className="bg-white p-8 rounded-3xl shadow-sm flex-1 flex flex-col">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-8">Research Context Builder</h1>
                
                {showInitialOptions && !isEditingScenario ? (
                  <InitialOptions 
                    initialQuery={initialQuery}
                    onContinue={() => handleInitialOption('continue')}
                    onSkip={() => handleInitialOption('skip')}
                  />
                ) : (
                  <>
                    <ConversationDisplay conversationHistory={conversationHistory} />
                    
                    {currentStep < steps.length && (
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
                        scenarios={generatedScenarios}
                        onScenarioSelect={handleScenarioSelection}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResearchContext;
