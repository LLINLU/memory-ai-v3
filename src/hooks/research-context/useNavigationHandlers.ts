
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ContextAnswers, ConversationMessage } from "./useConversationState";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showScenarios, setShowScenarios] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState<string[]>([]);

  const handleInitialOption = (option: 'continue' | 'skip') => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return false;
    }
    
    if (option === 'skip') {
      navigate('/technology-tree', { state: { query: initialQuery, quickSearch: true } });
    } else {
      setShowInitialOptions(false);
      return true; // Signal to parent hook to add initial message
    }
    
    return false;
  };

  const generateScenarios = () => {
    // Filter out empty answers
    const filledAnswers = Object.fromEntries(
      Object.entries(answers).filter(([_, value]) => value.trim() !== '')
    );
    
    // Generate three different scenarios based on the user's answers
    const scenarios = [
      generateScenario(initialQuery, filledAnswers, 1),
      generateScenario(initialQuery, filledAnswers, 2),
      generateScenario(initialQuery, filledAnswers, 3)
    ];
    
    setGeneratedScenarios(scenarios);
    setShowScenarios(true);
    
    // Store generated scenarios in localStorage for later retrieval
    localStorage.setItem('generatedScenarios', JSON.stringify(scenarios));
    
    return scenarios;
  };
  
  const generateScenario = (query: string, filledAnswers: Record<string, string>, variant: number) => {
    // Base scenario is always the initial query
    let scenario = query;
    
    // If we have additional context, generate a more specific scenario
    if (Object.keys(filledAnswers).length > 0) {
      // Different variants emphasize different aspects of the research context
      switch(variant) {
        case 1:
          // Variant 1: Emphasize WHO and WHAT
          scenario = `${query} focusing on ${filledAnswers.who || 'researchers'} 
            working with ${filledAnswers.what || 'advanced techniques'} 
            ${filledAnswers.where ? `in ${filledAnswers.where}` : ''} 
            ${filledAnswers.when ? `during ${filledAnswers.when}` : ''}`;
          break;
        case 2:
          // Variant 2: Emphasize WHERE and WHEN
          scenario = `${query} applications 
            ${filledAnswers.where ? `in ${filledAnswers.where}` : 'in various settings'} 
            ${filledAnswers.when ? `during ${filledAnswers.when}` : 'at different stages'} 
            involving ${filledAnswers.who || 'various stakeholders'} 
            ${filledAnswers.what ? `addressing ${filledAnswers.what}` : ''}`;
          break;
        case 3:
          // Variant 3: Balanced approach with different phrasing
          scenario = `Research on ${query} 
            ${filledAnswers.what ? `with emphasis on ${filledAnswers.what}` : ''} 
            ${filledAnswers.who ? `conducted by or benefiting ${filledAnswers.who}` : ''} 
            ${filledAnswers.where ? `within ${filledAnswers.where} contexts` : ''} 
            ${filledAnswers.when ? `particularly relevant ${filledAnswers.when}` : ''}`;
          break;
      }
    }
    
    // Clean up any double spaces and trim
    return scenario.replace(/\s+/g, ' ').trim();
  };

  const selectScenario = (selectedScenario: string) => {
    // Store conversation history in localStorage before navigating
    localStorage.setItem('researchContextHistory', JSON.stringify(conversationHistory));
    
    navigate('/technology-tree', { 
      state: { 
        query: initialQuery,
        scenario: selectedScenario,
        contextAnswers: answers 
      } 
    });
  };

  const proceedToTechnologyTree = () => {
    // Generate scenarios after completing all questions
    const scenarios = generateScenarios();
    
    return scenarios;
  };

  return {
    showInitialOptions,
    showScenarios,
    generatedScenarios,
    handleInitialOption,
    proceedToTechnologyTree,
    selectScenario,
    setShowScenarios,
    setGeneratedScenarios
  };
};
