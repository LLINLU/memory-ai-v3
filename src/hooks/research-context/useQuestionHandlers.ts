
import React, { useState } from "react";
import { ContextAnswers, ConversationMessage } from "./types";
import { Step } from "@/components/research-context/ResearchSteps";
import { Button } from "@/components/ui/button";
import { OptionSelection } from "@/components/research-context/OptionSelection";

export const useQuestionHandlers = (
  steps: Step[],
  currentStep: number, 
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  conversationHistory: ConversationMessage[],
  setConversationHistory: React.Dispatch<React.SetStateAction<ConversationMessage[]>>,
  answers: ContextAnswers,
  setAnswers: React.Dispatch<React.SetStateAction<ContextAnswers>>,
  selectedOption: string,
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>,
  helpButtonClicked: boolean,
  setHelpButtonClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle option selection from predefined buttons
  const handleOptionSelect = (value: string, label: string) => {
    setSelectedOption(value);
    
    // Add user response to conversation history using the exact label from the button
    setConversationHistory(prev => [
      ...prev,
      { type: "user", content: label }
    ]);

    // Update answers state
    const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
    const newAnswers = { ...answers };
    newAnswers[currentKey] = label;
    setAnswers(newAnswers);
    
    // Clear input field
    setInputValue("");
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Add next question immediately after selecting an option
    if (nextStep < steps.length) {
      addNextQuestion(nextStep);
    } else {
      addCompletionMessage();
    }
  };

  // Handle user text input submission
  const addUserResponse = (userInput: string | null) => {
    if (userInput) {
      // Add user response to conversation history
      setConversationHistory(prev => [
        ...prev,
        { type: "user", content: userInput }
      ]);

      // Update answers state
      const currentKey = Object.keys(answers)[currentStep] as keyof typeof answers;
      const newAnswers = { ...answers };
      newAnswers[currentKey] = userInput;
      setAnswers(newAnswers);
    } else {
      // Special case for skipping the first question
      if (currentStep === 0) {
        // Add custom skip message for first question
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "スキップ" },
          { 
            type: "system", 
            content: "より良い検索結果を得るために、この質問にご回答いただけると嬉しいです😊。上の鉛筆アイコンをクリックすると、ご回答できます。"
          }
        ]);
      } else {
        // Add regular skip message for other questions
        setConversationHistory(prev => [
          ...prev,
          { type: "user", content: "Skipped" }
        ]);
      }
    }

    // Clear input field
    setInputValue("");
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
    
    // Add the next question immediately after adding the user response
    if (currentStep + 1 < steps.length) {
      addNextQuestion(currentStep + 1);
    } else {
      addCompletionMessage();
    }
  };

  // Update an existing user response
  const updateUserResponse = (content: string, index: number) => {
    // Find which question this response was for
    const questionBeforeIndex = index - 1;
    let questionType = "";
    
    if (questionBeforeIndex >= 0 && conversationHistory[questionBeforeIndex].questionType) {
      questionType = conversationHistory[questionBeforeIndex].questionType || "";
    }

    // Update the conversation history
    setConversationHistory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], content };
      return updated;
    });

    // Also update the answers state if we can determine which one to update
    if (questionType && Object.keys(answers).includes(questionType)) {
      setAnswers(prev => ({
        ...prev,
        [questionType]: content
      }));
    }

    // Reset current step to the next question after this edited response
    const nextQuestionIndex = Math.floor((index + 2) / 2);
    setCurrentStep(nextQuestionIndex);
  };

  return {
    handleOptionSelect,
    addUserResponse,
    updateUserResponse
  };
};

export default useQuestionHandlers;
