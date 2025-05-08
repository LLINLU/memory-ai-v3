
import { useCallback, useEffect, RefObject } from "react";

export const useConversationScroll = (
  conversationEndRef: RefObject<HTMLDivElement>,
  conversationLength: number
) => {
  // Scroll to bottom function with proper handling
  const scrollToBottom = useCallback(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, [conversationEndRef]);

  // Scroll to bottom when conversation history changes
  useEffect(() => {
    // Only auto-scroll on new messages
    if (conversationLength > 0) {
      scrollToBottom();
    }
  }, [conversationLength, scrollToBottom]);

  return { scrollToBottom };
};
