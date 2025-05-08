
import { Step } from "@/components/research-context/ResearchSteps";
import { useConversationState } from "./research-context/useConversationState";
import { useNavigationHandlers } from "./research-context/useNavigationHandlers";
import { useScenarioHandlers } from "./research-context/useScenarioHandlers";
import { useNavigate } from "react-router-dom";

export const useResearchContext = (initialQuery: string, steps: Step[], isEditingScenario: boolean = false, currentScenario: string = "") => {
  const navigate = useNavigate();

  // Use the conversation state hook
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
    updateUserResponse,
    setInputValue,
    resetConversation
  } = useConversationState(steps);

  // Use the navigation handlers hook
  const {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    handleInitialOption,
    proceedToTechnologyTree,
    selectScenario,
    setShowScenarios,
    generateScenarios,
    resetNavigation,
    researchAreasRef,
    setGeneratedScenarios
  } = useNavigationHandlers({
    initialQuery,
    answers,
    conversationHistory
  });

  // Use the scenario handlers hook
  const {
    selectedScenario,
    handleScenarioSelection,
    handleReset,
    handleGenerateResult
  } = useScenarioHandlers({
    initialQuery,
    navigate,
    isEditingScenario,
    currentScenario,
    generateScenarios,
    setShowScenarios,
    setGeneratedScenarios,
    selectScenario,
    resetNavigation,
    resetConversation,
    answers // Pass the answers to the scenario handlers
  });

  // Core handler for initial option selection
  const handleInitialOptionWrapper = (option: 'continue' | 'skip') => {
    const shouldContinue = handleInitialOption(option);
    if (shouldContinue) {
      // Add the initial message and first question
      addInitialMessage();
    } else if (option === 'skip') {
      // Even if skipping the questions flow, we should show scenarios
      setTimeout(() => {
        proceedToTechnologyTree();
      }, 1000);
    }
    return shouldContinue;
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
      }, 1000);
    }
    
    // Reset the input value after submission
    setInputValue("");
  };
  
  // Core handler for skip action
  const handleSkip = () => {
    if (currentStep >= steps.length) return;
    
    // Process the skip
    addUserResponse(null);
    
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
      }, 1000);
    }
  };

  // Handle editing a user reply
  const handleEditUserReply = (content: string, index: number) => {
    updateUserResponse(content, index);
    setInputValue(content);
  };

  // Check if we should show the input section
  const shouldShowInputSection = !showInitialOptions && currentStep <= steps.length;

  return {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    selectedScenario,
    handleInitialOption: handleInitialOptionWrapper,
    handleInputChange,
    handleSubmit,
    handleSkip,
    handleScenarioSelection,
    proceedToScenarios: proceedToTechnologyTree,
    setShowScenarios,
    handleEditUserReply,
    handleReset,
    handleGenerateResult,
    researchAreasRef,
    shouldShowInputSection,
    isEditingScenario
  };
};
