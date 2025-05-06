
import { Step } from "@/components/research-context/ResearchSteps";
import { useConversationState } from "./research-context/useConversationState";
import { useNavigationHandlers } from "./research-context/useNavigationHandlers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useResearchContext = (initialQuery: string, steps: Step[], isEditingScenario: boolean = false, currentScenario: string = "") => {
  const navigate = useNavigate();
  // Track selected scenario
  const [selectedScenario, setSelectedScenario] = useState<string>(currentScenario || "");

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
    setConversationHistory,
    updateUserResponse,
    setInputValue,
    resetConversation
  } = useConversationState(steps);

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

  // Handle scenario editing mode on component mount
  useEffect(() => {
    if (isEditingScenario) {
      // Skip the conversation and show scenarios
      setShowScenarios(true);
      
      // Generate scenarios including the current one
      const scenarios = generateScenarios();
      
      // If the current scenario is not in the generated list, add it
      if (currentScenario && !scenarios.includes(currentScenario)) {
        const updatedScenarios = [currentScenario, ...scenarios];
        setGeneratedScenarios(updatedScenarios);
      }
      
      // Select the current scenario
      if (currentScenario) {
        setSelectedScenario(currentScenario);
        selectScenario(currentScenario);
      }
    }
  }, [isEditingScenario, currentScenario]);

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
      }, 1000);
    }
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

  const handleScenarioSelection = (selectedScenarioText: string) => {
    setSelectedScenario(selectedScenarioText);
    selectScenario(selectedScenarioText);
  };

  // Function to directly proceed to scenarios without going through conversation
  const proceedToScenarios = () => {
    generateScenarios();
  };

  // Handle editing a user reply
  const handleEditUserReply = (content: string, index: number) => {
    updateUserResponse(content, index);
    setInputValue(content);
  };

  // Handle resetting the conversation
  const handleReset = () => {
    // Reset conversation state
    resetConversation();
    
    // Reset navigation state
    resetNavigation();
    
    // Reset selected scenario
    setSelectedScenario("");
    
    // Force navigation to the same page to ensure a clean state
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    navigate(currentPath + "?" + searchParams.toString(), { replace: true });
  };

  // Function to generate search results and navigate to technology tree
  const handleGenerateResult = () => {
    // Navigate to the technology tree page with the selected scenario
    navigate('/technology-tree', {
      state: {
        query: initialQuery,
        scenario: selectedScenario || `Research on ${initialQuery}`
      }
    });
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
    proceedToScenarios,
    setShowScenarios,
    handleEditUserReply,
    handleReset,
    handleGenerateResult,
    steps,
    researchAreasRef,
    shouldShowInputSection,
    isEditingScenario
  };
};
