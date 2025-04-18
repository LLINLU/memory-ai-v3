
import { TabsHorizontal, TabsHorizontalContent } from "@/components/ui/tabs";
import { SearchResults } from "./SearchResults";
import { ChatContent } from "./ChatContent";
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
    <div className="flex flex-col h-full">
      <TabsHorizontal value={sidebarTab} className="flex-1">
        <TabsHorizontalContent value="result" className="h-full">
          <SearchResults />
        </TabsHorizontalContent>

        <TabsHorizontalContent value="chat" className="h-full flex flex-col bg-[#fffdf5]">
          <div className="flex-1 overflow-auto p-4">
            <ChatContent chatMessages={chatMessages} />
          </div>
          {sidebarTab === 'chat' && (
            <ChatInput
              value={inputValue}
              onChange={onInputChange}
            />
          )}
        </TabsHorizontalContent>
      </TabsHorizontal>
    </div>
  );
};
