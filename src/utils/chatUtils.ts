
import { ChatMessage, NodeSuggestion } from '@/types/chat';

const generateNodeSuggestion = (message: string): NodeSuggestion => {
  // Extract potential topics from the message
  const topicKeywords = [
    'glaucoma', 'retinal', 'vision', 'disease', 'detection', 'screening',
    'neural network', 'deep learning', 'machine learning', 'algorithm',
    'diagnosis', 'medical', 'healthcare', 'imaging', 'analysis',
    'classification', 'computer vision', 'AI', 'artificial intelligence'
  ];
  
  // Check if any keywords appear in the message
  const matchedKeywords = topicKeywords.filter(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Generate title based on matched keywords or use a default
  let title = '';
  let description = '';
  
  if (matchedKeywords.length > 0) {
    // Use matched keywords to create a more relevant title and description
    if (message.toLowerCase().includes('glaucoma')) {
      title = "Automated Glaucoma Screening";
      description = "Combines computer vision and AI to provide rapid screening of glaucoma indicators in retinal images.";
    } 
    else if (message.toLowerCase().includes('neural') || message.toLowerCase().includes('deep learning')) {
      title = "Neural Network Disease Classification";
      description = "Leverages deep learning architectures to classify multiple retinal conditions from single-image inputs.";
    }
    else if (message.toLowerCase().includes('detection') || message.toLowerCase().includes('screening')) {
      title = "AI-Powered OCT Analysis";
      description = "Implements machine learning algorithms to analyze optical coherence tomography images for early disease detection.";
    }
    else {
      title = "Computer-Aided Diagnosis System";
      description = "Develops an automated system for assisting clinicians in diagnosing retinal pathologies.";
    }
  } else {
    // Default if no keywords match
    title = "Deep Learning for Retinal Disease Detection";
    description = "Uses convolutional neural networks to automatically detect and classify retinal diseases from OCT scans with high accuracy.";
  }
  
  return {
    title,
    description
  };
};

export const processUserMessage = (message: string): ChatMessage => {
  const suggestion = generateNodeSuggestion(message);

  return {
    content: `Got it — let's work together to create a node that matches what you have in mind.\n\nHere's my suggestion:\n🔹Title: ${suggestion.title}\n🔹Description: ${suggestion.description}\n\nWould you like to:`,
    isUser: false,
    suggestion,
    type: 'suggestion'
  };
};
