
import { TabsHorizontal, TabsHorizontalContent } from "@/components/ui/tabs";
import { SearchResults } from "./SearchResults";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";
import { FilterSort } from "./FilterSort";

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
      <div className="px-4 pt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">32 papers • 9 implementations</span>
        <FilterSort className="justify-end" />
      </div>
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
