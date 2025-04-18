
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
    <div>
      <TabsHorizontal value={sidebarTab} className="h-full">
        <TabsHorizontalContent value="result" className="h-full">
          <SearchResults />
        </TabsHorizontalContent>

        <TabsHorizontalContent value="chat" className="h-full p-4 overflow-auto bg-[#fffdf5]">
          <ChatContent chatMessages={chatMessages} />
        </TabsHorizontalContent>
      </TabsHorizontal>
    </div>
  );
};
