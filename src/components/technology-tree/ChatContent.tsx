
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
    <div className="space-y-4 px-4 py-2">
      {chatMessages.map((message, index) => {
        if (message.type === "system") {
          return (
            <div key={index} className="inline-block max-w-[85%] bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-gray-800 text-base leading-relaxed">
                {message.content}
              </p>
            </div>
          );
        }

        if (message.type === "criteria") {
          return (
            <div key={index} className="inline-block max-w-[85%] bg-white rounded-2xl p-4 shadow-sm">
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

        if (message.type === "progress") {
          return (
            <div key={index} className="inline-block max-w-[85%] bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-gray-800 text-lg font-semibold mb-3">{message.title}</h3>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{message.analyzed} results analyzed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{message.matched} results matched</span>
                </div>
              </div>
              <Progress value={65} className="h-1.5 w-full bg-gray-100" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
