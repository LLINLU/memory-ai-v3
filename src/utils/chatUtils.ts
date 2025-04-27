
import { ChatMessage, NodeSuggestion } from '@/types/chat';

const generateRandomSuggestion = (): NodeSuggestion => {
  const titles = [
    "Deep Learning for Retinal Disease Detection",
    "AI-Powered OCT Analysis",
    "Automated Glaucoma Screening",
    "Neural Network Disease Classification",
    "Computer-Aided Diagnosis System"
  ];

  const descriptions = [
    "Uses convolutional neural networks to automatically detect and classify retinal diseases from OCT scans with high accuracy.",
    "Implements machine learning algorithms to analyze optical coherence tomography images for early disease detection.",
    "Combines computer vision and AI to provide rapid screening of glaucoma indicators in retinal images.",
    "Leverages deep learning architectures to classify multiple retinal conditions from single-image inputs.",
    "Develops an automated system for assisting clinicians in diagnosing retinal pathologies."
  ];

  const randomIndex = Math.floor(Math.random() * titles.length);
  return {
    title: titles[randomIndex],
    description: descriptions[randomIndex]
  };
};

export const processUserMessage = (message: string): ChatMessage => {
  const hasKeywords = message.toLowerCase().includes('title') || 
                     message.toLowerCase().includes('description');

  const suggestion = generateRandomSuggestion();

  if (hasKeywords) {
    return {
      content: `Thank you! Let me help refine your "${message}" into something more specific and structured.\n\nHere's my suggestion:\n🔹Title: ${suggestion.title}\n🔹Description: ${suggestion.description}\n\nWould you like to:`,
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
