
import React from "react";
import { TabsHorizontal, TabsHorizontalContent } from "@/components/ui/tabs";
import { SearchResults } from "./SearchResults";
import { ChatInput } from "./ChatInput";
import { ChatConversation } from "./ChatConversation";
import { NodeSuggestion } from "@/types/chat";

interface SidebarContentProps {
  sidebarTab: string;
  chatMessages: any[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage?: () => void;
  onUseNode?: (suggestion: NodeSuggestion) => void;
  onEditNode?: (suggestion: NodeSuggestion) => void;
  onRefine?: (suggestion: NodeSuggestion) => void;
  onCheckResults?: () => void;
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
}

export const SidebarContent = ({
  sidebarTab,
  chatMessages,
  inputValue,
  onInputChange,
  onSendMessage,
  onUseNode,
  onEditNode,
  onRefine,
  onCheckResults,
  selectedNodeTitle,
  selectedNodeDescription
}: SidebarContentProps) => {
  return (
    <div className="h-full flex flex-col">
      <TabsHorizontal value={sidebarTab} className="h-full flex-1">
        <TabsHorizontalContent value="result" className="h-full">
          <SearchResults 
            selectedNodeTitle={selectedNodeTitle} 
            selectedNodeDescription={selectedNodeDescription}
          />
        </TabsHorizontalContent>

        <TabsHorizontalContent value="chat" className="h-full flex flex-col bg-[#f6f6f6]">
          {sidebarTab === "chat" && (
            <>
              <ChatConversation 
                chatMessages={chatMessages} 
                onUseNode={onUseNode}
                onEditNode={onEditNode}
                onRefine={onRefine}
                onCheckResults={onCheckResults}
              />
              <ChatInput 
                value={inputValue} 
                onChange={onInputChange} 
                onSend={onSendMessage} 
              />
            </>
          )}
        </TabsHorizontalContent>
      </TabsHorizontal>
    </div>
  );
};
