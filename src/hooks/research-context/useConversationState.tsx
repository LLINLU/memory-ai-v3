
import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";
import { Button } from "@/components/ui/button";
import { ContextAnswers, ConversationMessage, UseConversationStateReturn } from "./types";
import { useMessageActions } from "./useMessageActions";
import { useResponseHandlers } from "./useResponseHandlers";

export type {
  ContextAnswers,
  ConversationMessage,
  UseConversationStateReturn
};

export const useConversationState = (steps: Step[]): UseConversationStateReturn => {
  // Core state
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [answers, setAnswers] = useState<ContextAnswers>({
    what: "",
    who: "",
    where: "",
    when: ""
  });
  
  // UI state
  const [helpButtonClicked, setHelpButtonClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [completionMessageAdded, setCompletionMessageAdded] = useState(false);

  // Message action handlers
  const {
    addNextQuestion,
    addInitialMessage,
    addCompletionMessage,
    handleHelpMeClick
  } = useMessageActions(
    steps,
    currentStep,
    answers,
    conversationHistory,
    setConversationHistory,
    setHelpButtonClicked,
    completionMessageAdded,
    setCompletionMessageAdded
  );

  // Response handlers
  const {
    handleOptionSelect,
    addUserResponse,
    updateUserResponse
  } = useResponseHandlers(
    currentStep,
    setCurrentStep,
    conversationHistory,
    setConversationHistory,
    answers,
    setAnswers,
    setInputValue,
    setSelectedOption,
    addNextQuestion,
    addCompletionMessage,
    completionMessageAdded
  );

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Reset conversation handler
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
    setCompletionMessageAdded(false);
  };

  return {
    // State
    currentStep,
    inputValue,
    conversationHistory,
    answers,
    selectedOption,
    helpButtonClicked,
    completionMessageAdded,
    
    // Actions
    handleInputChange,
    handleOptionSelect,
    addUserResponse,
    addNextQuestion,
    addCompletionMessage,
    addInitialMessage,
    setConversationHistory,
    updateUserResponse,
    setInputValue,
    resetConversation,
    handleHelpMeClick
  };
};
