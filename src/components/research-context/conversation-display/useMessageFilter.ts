interface Message {
  type: "system" | "user";
  content: React.ReactNode | string;
  questionType?: string;
}

export const useMessageFilter = (conversationHistory: Message[]) => {
  // Filter out duplicate messages with the same questionType
  const filteredHistory = conversationHistory.filter((message, index, array) => {
    // Always keep user messages
    if (message.type === "user") return true;
    
    // If it's a system message with a questionType
    if (message.type === "system" && message.questionType) {
      // Check if this is the first occurrence of this questionType
      const firstIndex = array.findIndex(
        m => m.type === "system" && m.questionType === message.questionType
      );
      
      // If this is the first occurrence, keep it
      return firstIndex === index;
    }
    
    // Keep all other messages (system messages without questionType)
    return true;
  });
  
  return filteredHistory;
};
