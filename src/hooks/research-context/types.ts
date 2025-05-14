
import React from "react";

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

export interface Step {
  icon: React.ReactNode;
  question: string;
  subtitle: string[];
  placeholder?: string;
  helpButtonText?: string;
}
