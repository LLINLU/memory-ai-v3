
import { useEffect } from "react";
import { ChatMessage } from "@/types/chat";

interface ChatInitializationProps {
  locationState: { query?: string; scenario?: string } | null;
  chatMessages: ChatMessage[];
  setChatMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  handleSwitchToChat: (message: string) => void;
}

export const useChatInitialization = ({
  locationState,
  chatMessages,
  setChatMessages,
  handleSwitchToChat
}: ChatInitializationProps) => {
  // Initialize chat with a welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      if (locationState?.scenario) {
        // If there's a scenario, just show a welcome message that doesn't include previous research context
        const welcomeMessage = `Welcome to your research on ${locationState.scenario}. How can I assist you?`;
        
        setChatMessages(() => [{
          type: "text",
          content: welcomeMessage,
          isUser: false
        }]);
      }
    }
  }, [locationState, chatMessages.length, setChatMessages]);

  // Note: Removed the conflicting 'switch-to-chat' event listener that was 
  // interfering with the new ChatBox implementation
};
