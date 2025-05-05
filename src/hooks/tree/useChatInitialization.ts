
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
  // Initialize chat with context data from ResearchContext
  useEffect(() => {
    if (locationState?.scenario && chatMessages.length === 0) {
      const contextData = `Based on your research interests in ${locationState.scenario}, I've created this technology tree. You can explore different branches or ask me for more specific information.`;
      
      setChatMessages([{
        type: "text",
        content: contextData,
        isUser: false
      }]);
    }
  }, [locationState, chatMessages.length, setChatMessages]);

  // Set up event listener for switching to chat
  useEffect(() => {
    const handleSwitchToChatEvent = (event: CustomEvent) => {
      handleSwitchToChat(event.detail.message);
    };

    document.addEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    
    return () => {
      document.removeEventListener('switch-to-chat', handleSwitchToChatEvent as EventListener);
    };
  }, [handleSwitchToChat]);
};
