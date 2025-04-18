
import { TabsHorizontal, TabsHorizontalContent } from "@/components/ui/tabs";
import { SearchResults } from "./SearchResults";
import { ChatInput } from "./ChatInput";

interface SidebarContentProps {
  sidebarTab: string;
  chatMessages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SidebarContent = ({
  sidebarTab,
  chatMessages,
  inputValue,
  onInputChange
}: SidebarContentProps) => {
  return (
    <div className="h-full flex flex-col">
      <TabsHorizontal value={sidebarTab} className="h-full flex-1">
        <TabsHorizontalContent value="result" className="h-full">
          <SearchResults />
        </TabsHorizontalContent>

        <TabsHorizontalContent value="chat" className="h-full flex flex-col bg-[#f6f6f6]">
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
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
          </div>
          <ChatInput value={inputValue} onChange={onInputChange} />
        </TabsHorizontalContent>
      </TabsHorizontal>
    </div>
  );
};
