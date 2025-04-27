
export interface NodeSuggestion {
  title: string;
  description: string;
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  suggestion?: NodeSuggestion;
  type?: 'suggestion' | 'text' | 'confirmation';
  isActionTaken?: boolean;
}
