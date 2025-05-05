
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
  // Initialize chat with stored research context conversations
  useEffect(() => {
    if (chatMessages.length === 0) {
      const storedHistory = localStorage.getItem('researchContextHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        const chatHistoryMessages = parsedHistory.map((msg: any) => ({
          type: "text",
          content: typeof msg.content === 'string' ? msg.content : 'User response',
          isUser: msg.type === 'user'
        }));
        
        setChatMessages(prev => chatHistoryMessages);
      } else if (locationState?.scenario) {
        // If no stored history, show the scenario message
        const contextData = `Based on your research interests in ${locationState.scenario}, I've created this technology tree. You can explore different branches or ask me for more specific information.`;
        
        setChatMessages(prev => [{
          type: "text",
          content: contextData,
          isUser: false
        }]);
      }
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
