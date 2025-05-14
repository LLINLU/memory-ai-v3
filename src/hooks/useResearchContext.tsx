
import { Step } from "@/components/research-context/ResearchSteps";
import { useConversationState, ContextAnswers, ConversationMessage } from "./research-context/useConversationState";
import { useNavigationHandlers } from "./research-context/useNavigationHandlers";
import { useScenarioHandlers } from "./research-context/useScenarioHandlers";
import { useNavigate } from "react-router-dom";

export const useResearchContext = (
  initialQuery: string, 
  steps: Step[], 
  isEditingScenario: boolean = false, 
  currentScenario: string = "",
  savedConversationHistory: any[] = []
) => {
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
    resetConversation,
    setConversationHistory,
    showingSkipHint
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
    answers,
    conversationHistory
  });

  // Initialize saved conversation history
  const initializeSavedHistory = (savedHistory: any[]) => {
    if (savedHistory && savedHistory.length > 0) {
      setConversationHistory(savedHistory);
    }
  };

  // Core handler for initial option selection
  const handleInitialOptionWrapper = (option: 'continue' | 'skip') => {
    const shouldContinue = handleInitialOption(option);
    if (shouldContinue) {
      addInitialMessage();
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
    
    // Only add next question if we're not showing a skip hint
    if (!showingSkipHint) {
      const nextStep = currentStep + 1;
      
      // If not at the end, add the next question
      if (nextStep < steps.length) {
        addNextQuestion(nextStep);
      } else {
        // All steps completed, show completion message
        addCompletionMessage();
        
        // Show scenarios after a short delay
        setTimeout(() => {
          proceedToTechnologyTree();
        }, 1000);
      }
    }
  };
  
  // Core handler for skip action
  const handleSkip = () => {
    if (currentStep >= steps.length) return;
    
    // Process the skip
    addUserResponse(null);
    
    // Only add next question if we're not showing a skip hint
    if (!showingSkipHint) {
      const nextStep = currentStep + 1;
      
      // If not at the end, add the next question
      if (nextStep < steps.length) {
        addNextQuestion(nextStep);
      } else {
        // All steps completed, show completion message
        addCompletionMessage();
        
        // Show scenarios after a short delay
        setTimeout(() => {
          proceedToTechnologyTree();
        }, 1000);
      }
    }
  };

  // Handle editing a user reply
  const handleEditUserReply = (content: string, index: number) => {
    updateUserResponse(content, index);
    setInputValue(content);
  };

  // Check if we should show the input section
  const shouldShowInputSection = !showInitialOptions && !showScenarios && currentStep < steps.length;

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
    isEditingScenario,
    initializeSavedHistory
  };
};
