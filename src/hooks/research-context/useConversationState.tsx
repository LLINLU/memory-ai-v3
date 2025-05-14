
import React, { useState } from "react";
import { Step } from "@/components/research-context/ResearchSteps";
import { Button } from "@/components/ui/button";
import { ContextAnswers, ConversationMessage } from "./types";
import { useHelpButtonHandlers } from "./useHelpButtonHandlers";
import { useQuestionHandlers } from "./useQuestionHandlers";

export { ContextAnswers, ConversationMessage };

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
  const [showingSkipHint, setShowingSkipHint] = useState(false);

  // Import handlers from separated hooks
  const { handleHelpMeClick, addInitialMessage: initMessage } = useHelpButtonHandlers(
    setConversationHistory,
    setHelpButtonClicked,
    steps,
    setShowingSkipHint
  );

  const { 
    addUserResponse: addUserResponseHandler,
    updateUserResponse,
    addNextQuestion: addNextQuestionHandler,
    addCompletionMessage
  } = useQuestionHandlers(
    setConversationHistory,
    setCurrentStep,
    setShowingSkipHint,
    setInputValue,
    answers,
    setAnswers
  );

  // Simple handlers that don't need to be moved to separate files
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Wrapper functions for handlers to provide current state
  const addUserResponse = (userInput: string | null) => {
    addUserResponseHandler(userInput, currentStep, showingSkipHint);
  };

  const addNextQuestion = (nextStep: number) => {
    addNextQuestionHandler(nextStep, steps);
  };

  const addInitialMessage = () => {
    initMessage(steps, helpButtonClicked);
  };

  // Reset conversation to initial state
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
    setShowingSkipHint(false);
  };

  return {
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
    resetConversation,
    showingSkipHint
  };
};
