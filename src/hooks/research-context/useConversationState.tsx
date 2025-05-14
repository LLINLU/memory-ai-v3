
import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";
import { ContextAnswers, ConversationMessage } from "./types";
import { useQuestionHandlers } from "./useQuestionHandlers";
import { useMessageHandlers } from "./useMessageHandlers";

export { ContextAnswers, ConversationMessage } from "./types";

export const useConversationState = (steps: Step[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [answers, setAnswers] = useState<ContextAnswers>({
    what: "",
    who: "",
    where: "",
    when: ""
  });
  const [helpButtonClicked, setHelpButtonClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Get question handlers
  const {
    handleOptionSelect,
    addUserResponse,
    updateUserResponse
  } = useQuestionHandlers(
    steps,
    currentStep,
    setCurrentStep,
    inputValue,
    setInputValue,
    conversationHistory,
    setConversationHistory,
    answers,
    setAnswers,
    selectedOption,
    setSelectedOption,
    helpButtonClicked,
    setHelpButtonClicked
  );

  // Get message handlers
  const {
    addNextQuestion,
    addCompletionMessage,
    addInitialMessage,
    handleHelpMeClick
  } = useMessageHandlers(
    steps,
    currentStep,
    setConversationHistory,
    answers,
    helpButtonClicked,
    setHelpButtonClicked,
    handleOptionSelect,
    selectedOption
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const resetConversation = () => {
    setCurrentStep(0);
    setInputValue("");
    setConversationHistory([]);
    setAnswers({
      what: "",
      who: "",
      where: "",
      when: ""
    });
    setHelpButtonClicked(false);
    setSelectedOption("");
  };

  return {
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
    setConversationHistory,
    updateUserResponse,
    setInputValue,
    resetConversation
  };
};

export default useConversationState;
