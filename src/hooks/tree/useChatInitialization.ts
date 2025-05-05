
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
        try {
          const parsedHistory = JSON.parse(storedHistory);
          
          // Convert the history to chat messages format with correct updater function
          setChatMessages(() => {
            // Create properly formatted chat messages from the history
            return parsedHistory.map((msg: any) => ({
              type: "text",
              // For user messages, display the exact content
              content: typeof msg.content === 'string' 
                ? msg.content 
                : (msg.type === 'system' ? 'AI Assistant' : (msg.questionType || 'User response')),
              isUser: msg.type === 'user'
            }));
          });
        } catch (error) {
          console.error("Failed to parse research context history:", error);
        }
      } else if (locationState?.scenario) {
        // If no stored history, show the scenario message with correct updater function
        const contextData = `Based on your research interests in ${locationState.scenario}, I've created this technology tree. You can explore different branches or ask me for more specific information.`;
        
        setChatMessages(() => [{
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
