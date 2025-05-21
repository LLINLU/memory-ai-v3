
import React from "react";
import { Step } from "@/components/research-context/ResearchSteps";

export interface ContextAnswers {
  what: string;
  who: string;
  where: string;
  when: string;
}

export interface ConversationMessage {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

export interface ConversationState {
  currentStep: number;
  inputValue: string;
  conversationHistory: ConversationMessage[];
  answers: ContextAnswers;
  helpButtonClicked: boolean;
  selectedOption: string;
  completionMessageAdded: boolean;
}

export interface ConversationActions {
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleOptionSelect: (value: string, label: string) => void;
  addUserResponse: (userInput: string | null) => void;
  updateUserResponse: (content: string, index: number) => void;
  addNextQuestion: (nextStep: number) => void;
  addCompletionMessage: () => void;
  addInitialMessage: () => void;
  setInputValue: (value: string) => void;
  resetConversation: () => void;
  setConversationHistory: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
  handleHelpMeClick: () => void;
}

export type UseConversationStateReturn = ConversationState & ConversationActions;
