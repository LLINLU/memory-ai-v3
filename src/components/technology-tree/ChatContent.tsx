import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChatMessage {
  type: string;
  content?: string;
  title?: string;
  items?: string[];
  showMore?: boolean;
  searchingCount?: number;
  analyzed?: number;
  matched?: number;
}

interface ChatContentProps {
  chatMessages: ChatMessage[];
}

export const ChatContent = ({ chatMessages }: ChatContentProps) => {
  return (
    <div className="space-y-6">
      {chatMessages.map((message, index) => {
        if (message.type === "system") {
          return (
            <div key={index} className="bg-[#f3f2e8] rounded-lg p-4">
              <p className="text-gray-800 text-lg font-medium">
                {message.content}
              </p>
              {message.showMore && (
               
              )}
            </div>
          );
        }

        if (message.type === "criteria") {
          return (
            <div key={index} className="bg-[#f3f2e8] rounded-lg p-4">
              <h3 className="text-gray-800 text-xl font-bold mb-3">{message.title}</h3>
              <ul className="space-y-2 mb-3">
                {message.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                    <ChevronRight className="h-5 w-5 mt-[2px] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {message.searchingCount && (
                <p className="font-semibold mb-3">Searching for {message.searchingCount} results</p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
