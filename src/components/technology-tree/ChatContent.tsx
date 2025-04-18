
import { ChevronRight } from "lucide-react";

interface ChatMessage {
  type: string;
  content?: string;
  title?: string;
  items?: string[];
  showMore?: boolean;
  searchingCount?: number;
  isUser?: boolean;
}

interface ChatContentProps {
  chatMessages: ChatMessage[];
}

export const ChatContent = ({ chatMessages }: ChatContentProps) => {
  return (
    <div className="space-y-4 px-4 py-2">
      {/* Path conversation bubbles */}
      {chatMessages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`inline-block max-w-[85%] p-4 rounded-2xl ${
              message.isUser 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-white text-gray-800'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          </div>
        </div>
      ))}

      {/* System messages */}
      {chatMessages.filter(m => m.type === "system" || m.type === "criteria").map((message, index) => {
        if (message.type === "system") {
          return (
            <div key={`sys-${index}`} className="inline-block max-w-[85%] bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-gray-800 text-base leading-relaxed">
                {message.content}
              </p>
            </div>
          );
        }

        if (message.type === "criteria") {
          return (
            <div key={`crit-${index}`} className="inline-block max-w-[85%] bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-gray-800 text-lg font-semibold mb-2">{message.title}</h3>
              <ul className="space-y-2 mb-2">
                {message.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                    <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              {message.searchingCount && (
                <p className="text-sm text-gray-600">Searching for {message.searchingCount} results</p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
