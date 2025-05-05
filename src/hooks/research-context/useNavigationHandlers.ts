
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ContextAnswers } from "./useConversationState";

interface NavigationHandlersProps {
  initialQuery: string;
  answers: ContextAnswers;
  conversationHistory: Array<{
    type: "system" | "user";
    content: React.ReactNode | string;
    questionType?: string;
  }>;
}

export const useNavigationHandlers = ({
  initialQuery,
  answers,
  conversationHistory
}: NavigationHandlersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);

  const handleInitialOption = (option: 'continue' | 'skip') => {
    if (!initialQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter a brief description of your research interest.",
        variant: "destructive"
      });
      return;
    }
    
    if (option === 'skip') {
      navigate('/technology-tree', { state: { query: initialQuery, quickSearch: true } });
    } else {
      setShowInitialOptions(false);
      return true; // Signal to parent hook to add initial message
    }
    
    return false;
  };

  const proceedToTechnologyTree = () => {
    // Filter out empty answers
    const filledAnswers = Object.fromEntries(
      Object.entries(answers).filter(([_, value]) => value.trim() !== '')
    );
    
    // Create scenario from answers
    let scenario = initialQuery;
    
    // If we have additional context from the 4W questions, add it to the scenario
    if (Object.keys(filledAnswers).length > 0) {
      scenario = `${initialQuery} with focus on ` + 
        Object.entries(filledAnswers)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
    }
    
    // Store conversation history in localStorage before navigating
    localStorage.setItem('researchContextHistory', JSON.stringify(conversationHistory));
    
    navigate('/technology-tree', { 
      state: { 
        query: initialQuery,
        scenario,
        contextAnswers: answers 
      } 
    });
  };

  return {
    showInitialOptions,
    handleInitialOption,
    proceedToTechnologyTree
  };
};
