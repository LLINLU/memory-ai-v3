import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { ContextAnswers } from "./useConversationState";
import { ConversationMessage } from "./useConversationState";

interface ScenarioHandlersProps {
  initialQuery: string;
  navigate: NavigateFunction;
  isEditingScenario: boolean;
  currentScenario: string;
  generateScenarios: () => string[];
  setShowScenarios: (value: boolean) => void;
  setGeneratedScenarios: (scenarios: string[]) => void;
  selectScenario: (scenario: string) => void;
  resetNavigation: () => void;
  resetConversation: () => void;
  answers: ContextAnswers;
  conversationHistory: ConversationMessage[];
  treemapData?: any[]; // Add treemap data parameter
}

export const useScenarioHandlers = ({
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
  conversationHistory,
  treemapData = []
}: ScenarioHandlersProps) => {
  // Track selected scenario
  const [selectedScenario, setSelectedScenario] = useState<string>(currentScenario || "");
  
  // Handle scenario editing mode on component mount
  useEffect(() => {
    if (isEditingScenario) {
      // Skip the conversation and show scenarios immediately
      setShowScenarios(true);
      
      // Generate scenarios including the current one
      const scenarios = generateScenarios();
      
      // If the current scenario is not in the generated list, add it
      if (currentScenario && !scenarios.includes(currentScenario)) {
        const updatedScenarios = [currentScenario, ...scenarios];
        setGeneratedScenarios(updatedScenarios);
      } else {
        setGeneratedScenarios(scenarios);
      }
      
      // Always select the current scenario when editing
      if (currentScenario) {
        setSelectedScenario(currentScenario);
        selectScenario(currentScenario);
      }
      
      // The toast notification has been removed from here
    }
  }, [isEditingScenario, currentScenario, setShowScenarios, generateScenarios, setGeneratedScenarios, selectScenario]);

  // Handle selecting a scenario
  const handleScenarioSelection = (selectedScenarioText: string) => {
    setSelectedScenario(selectedScenarioText);
    selectScenario(selectedScenarioText);
  };

  // Handle resetting the conversation
  const handleReset = () => {
    // Reset conversation and navigation states
    resetConversation();
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
    console.log("Navigating to technology tree with scenario:", selectedScenario);
    console.log("Including treemap data:", treemapData);
    
    // Create a serializable version of the conversation history
    const serializableHistory = conversationHistory.map(msg => ({
      type: msg.type,
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
      questionType: msg.questionType
    }));
    
    // Navigate to the technology tree page with the selected scenario and research answers
    navigate('/technology-tree', {
      state: {
        query: initialQuery,
        scenario: selectedScenario || `Research on ${initialQuery}`,
        searchMode: "deep", // Explicitly set searchMode to "deep" when coming from research-context
        researchAnswers: answers,
        conversationHistory: serializableHistory,
        treemapData: treemapData // Pass generated treemap data
      }
    });
  };

  return {
    selectedScenario,
    handleScenarioSelection,
    handleReset,
    handleGenerateResult
  };
};
