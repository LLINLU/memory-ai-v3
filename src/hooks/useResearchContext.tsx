
import { Step } from "@/components/research-context/ResearchSteps";
import { useConversationState } from "./research-context/useConversationState";
import { useNavigationHandlers } from "./research-context/useNavigationHandlers";

export const useResearchContext = (initialQuery: string, steps: Step[]) => {
  // Use the extracted hooks
  const {
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    handleInputChange,
    addUserResponse,
    addNextQuestion,
    addCompletionMessage,
    addInitialMessage,
    setConversationHistory
  } = useConversationState(steps);

  const {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    handleInitialOption,
    proceedToTechnologyTree,
    selectScenario
  } = useNavigationHandlers({
    initialQuery,
    answers,
    conversationHistory
  });

  // Core handler for initial option selection
  const handleInitialOptionWrapper = (option: 'continue' | 'skip') => {
    const shouldContinue = handleInitialOption(option);
    if (shouldContinue) {
      addInitialMessage();
    }
  };

  // Core handler for form submission
  const handleSubmit = () => {
    if (currentStep >= steps.length) return;
    
    // Process the user's response
    if (inputValue.trim()) {
      addUserResponse(inputValue);
    } else {
      // Handle empty submission as skip
      addUserResponse(null);
    }
    
    const nextStep = currentStep + 1;
    
    // If there are more steps, add the next question
    if (nextStep < steps.length) {
      addNextQuestion(nextStep);
    } else {
      // All steps completed, show completion message and generate scenarios
      addCompletionMessage();
      
      // Wait a moment before showing scenarios
      setTimeout(() => {
        proceedToTechnologyTree();
      }, 1500);
    }
  };
  
  // Core handler for skip action
  const handleSkip = () => {
    if (currentStep >= steps.length) return;
    
    // Process the skip
    addUserResponse(null);
    const nextStep = currentStep;
    
    // If there are more steps, add the next question
    if (nextStep < steps.length) {
      addNextQuestion(nextStep);
    } else {
      // All steps completed, show completion message and generate scenarios
      addCompletionMessage();
      
      // Wait a moment before showing scenarios
      setTimeout(() => {
        proceedToTechnologyTree();
      }, 1500);
    }
  };

  const handleScenarioSelection = (selectedScenario: string) => {
    selectScenario(selectedScenario);
  };

  return {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    currentStep,
    inputValue,
    conversationHistory,
    handleInitialOption: handleInitialOptionWrapper,
    handleInputChange,
    handleSubmit,
    handleSkip,
    handleScenarioSelection,
    steps,
  };
};
