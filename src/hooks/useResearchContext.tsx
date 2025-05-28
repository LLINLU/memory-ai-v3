
import { Step } from "@/components/research-context/ResearchSteps";
import { useConversationState } from "./research-context/useConversationState";
import { useNavigationHandlers } from "./research-context/useNavigationHandlers";
import { useScenarioHandlers } from "./research-context/useScenarioHandlers";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

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
    selectedOption,
    handleInputChange,
    handleOptionSelect,
    addUserResponse,
    addNextQuestion,
    addCompletionMessage,
    addInitialMessage,
    updateUserResponse,
    setInputValue,
    resetConversation,
    setConversationHistory
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

  // Create dummy conversation for scenario editing
  const createDummyConversation = useCallback(() => {
    // Clear any existing conversation
    resetConversation();
    
    // Create dummy conversation history that mimics a completed conversation
    const dummyConversation = [
      // First question about research purpose/approach (what)
      {
        type: "system" as const, 
        content: (
          <div>
            <div className="flex items-start gap-4">
              {steps[0].icon}
              <div>
                <h3 className="text-[16px] font-semibold">{steps[0].question}</h3>
                <ul className="mt-2 space-y-1">
                  {steps[0].subtitle.map((item, i) => (
                    <li key={i} className="text-gray-700 text-[14px]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ),
        questionType: "what"
      },
      // User response to first question
      { 
        type: "user" as const, 
        content: "ドライアイの診断と治療を改善するための患者用モニタリングデバイス"
      },
      
      // Second question about who is involved (who)
      {
        type: "system" as const,
        content: (
          <div>
            <div className="flex items-start gap-4">
              {steps[1].icon}
              <div>
                <h3 className="text-[16px] font-semibold">{steps[1].question}</h3>
                <ul className="mt-2 space-y-1">
                  {steps[1].subtitle.map((item, i) => (
                    <li key={i} className="text-gray-700 text-[14px]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ),
        questionType: "who"
      },
      // User response to second question
      {
        type: "user" as const,
        content: "眼科医と患者"
      },
      
      // Third question about where (where)
      {
        type: "system" as const,
        content: (
          <div>
            <div className="flex items-start gap-4">
              {steps[2].icon}
              <div>
                <h3 className="text-[16px] font-semibold">{steps[2].question}</h3>
                <ul className="mt-2 space-y-1">
                  {steps[2].subtitle.map((item, i) => (
                    <li key={i} className="text-gray-700 text-[14px]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ),
        questionType: "where"
      },
      // User response to third question
      {
        type: "user" as const,
        content: "眼科クリニックと患者の自宅"
      },
      
      // Fourth question about when/context (when)
      {
        type: "system" as const,
        content: (
          <div>
            <div className="flex items-start gap-4">
              {steps[3].icon}
              <div>
                <h3 className="text-[16px] font-semibold">{steps[3].question}</h3>
                <ul className="mt-2 space-y-1">
                  {steps[3].subtitle.map((item, i) => (
                    <li key={i} className="text-gray-700 text-[14px]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ),
        questionType: "when"
      },
      // User response to fourth question
      {
        type: "user" as const,
        content: "日常生活での症状モニタリングと定期的な診療時"
      },
      
      // Completion message
      {
        type: "system" as const,
        content: "ご回答をもとに、いくつかの研究シナリオを作成しました。右側のプレビューパネルから選んでみてください!"
      }
    ];
    
    // Set the conversation history
    setConversationHistory(dummyConversation);
    
    // Update answers state based on dummy conversation
    const newAnswers = {
      what: "ドライアイの診断と治療を改善するための患者用モニタリングデバイス",
      who: "眼科医と患者",
      where: "眼科クリニックと患者の自宅",
      when: "日常生活での症状モニタリングと定期的な診療時"
    };
    
    // Proceed to show scenarios
    setShowScenarios(true);
    
    return newAnswers;
  }, [steps, resetConversation, setConversationHistory, setShowScenarios]);

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
    selectedOption,
    selectedScenario,
    handleInitialOption: handleInitialOptionWrapper,
    handleInputChange,
    handleSubmit,
    handleSkip,
    handleOptionSelect,
    handleScenarioSelection,
    proceedToScenarios: proceedToTechnologyTree,
    setShowScenarios,
    handleEditUserReply,
    handleReset,
    handleGenerateResult,
    researchAreasRef,
    shouldShowInputSection,
    isEditingScenario,
    initializeSavedHistory,
    createDummyConversation
  };
};
