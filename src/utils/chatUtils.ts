
import { ChatMessage, NodeSuggestion } from '@/types/chat';

export const processUserMessage = (message: string): ChatMessage => {
  const hasKeywords = message.toLowerCase().includes('title') || 
                     message.toLowerCase().includes('description');

  const suggestion: NodeSuggestion = {
    title: 'Retinal OCT Scans',
    description: 'Describes the use of convolutional neural networks (CNNs) to process and interpret retinal OCT images for disease classification.'
  };

  if (hasKeywords) {
    return {
      content: `Thank you! Let me help refine your "${message}" into something more specific and structured.\n\nHere's the suggestion:\n🔹Title: ${suggestion.title}\n🔹Description: ${suggestion.description}\n\nWould you like to:`,
      isUser: false,
      suggestion,
      type: 'suggestion'
    };
  }

  return {
    content: `Got it — let's work together to create a node that matches what you have in mind.\n\nHere's my suggestion:\n🔹Title: ${suggestion.title}\n🔹Description: ${suggestion.description}\n\nWould you like to:`,
    isUser: false,
    suggestion,
    type: 'suggestion'
  };
};
