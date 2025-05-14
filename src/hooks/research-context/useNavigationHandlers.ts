
import { useState, useRef } from "react";
import { ContextAnswers, ConversationMessage } from "./types";

interface NavigationHandlersProps {
  initialQuery: string;
  answers: ContextAnswers;
  conversationHistory: ConversationMessage[];
}

export const useNavigationHandlers = ({ 
  initialQuery, 
  answers, 
  conversationHistory 
}: NavigationHandlersProps) => {
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showScenarios, setShowScenarios] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState<string[]>([]);
  const researchAreasRef = useRef<HTMLDivElement | null>(null);

  const handleInitialOption = (option: 'continue' | 'skip') => {
    setShowInitialOptions(false);
    
    // For continue, we return true to indicate we should show the first question
    // For skip, we immediately proceed to scenario generation
    if (option === 'skip') {
      proceedToTechnologyTree();
      return false;
    }
    
    return true;
  };

  const generateScenarios = () => {
    // In a real app, this could be a call to an API
    // For now, we'll generate mock scenarios based on the query and answers
    const scenarioTemplates = [
      `Research on ${initialQuery} focusing on ${answers.who || 'general audience'} and ${answers.what || 'general aspects'}`,
      `Exploring ${initialQuery} in the context of ${answers.where || 'various settings'} with emphasis on ${answers.who || 'practitioners'}`,
      `Analysis of ${initialQuery} applications for ${answers.who || 'professionals'} with focus on ${answers.when || 'current timeframe'}`
    ];
    
    setGeneratedScenarios(scenarioTemplates);
    return scenarioTemplates;
  };

  const proceedToTechnologyTree = () => {
    const scenarios = generateScenarios();
    setShowScenarios(true);
    return scenarios;
  };

  const selectScenario = (selectedScenario: string) => {
    // In a real app, this would navigate to the technology tree with the selected scenario
    console.log(`Selected scenario: ${selectedScenario}`);
    
    // Scroll to research areas after a short delay to ensure content is rendered
    setTimeout(() => {
      if (researchAreasRef.current) {
        researchAreasRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Reset navigation state
  const resetNavigation = () => {
    setShowInitialOptions(true);
    setShowScenarios(false);
    setGeneratedScenarios([]);
  };

  return {
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
  };
};
