
export interface NodeSuggestion {
  title: string;
  description: string;
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  suggestion?: NodeSuggestion;
  type?: 'suggestion' | 'text' | 'confirmation' | 'welcome';
  isActionTaken?: boolean;
  showCheckResults?: boolean;
  buttons?: {
    label: string;
    action: string;
    primary?: boolean;
  }[];
}
