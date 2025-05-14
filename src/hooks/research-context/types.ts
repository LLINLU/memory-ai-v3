
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
