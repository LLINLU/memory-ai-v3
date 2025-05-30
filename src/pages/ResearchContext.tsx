
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ConversationInterface } from "@/components/research-context/ConversationInterface";
import { ResearchContextSidebar } from "@/components/research-context/ResearchContextSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const ResearchContext = () => {
  const location = useLocation();
  const { query, searchMode } = location.state || { query: "", searchMode: "deep" };
  const [conversationContext, setConversationContext] = useState({
    query,
    messages: [],
    researchAnswers: {},
    refinementProgress: 0
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} minSize={40}>
          <ConversationInterface 
            query={query} 
            searchMode={searchMode}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <ResearchContextSidebar 
            query={conversationContext.query}
            conversationMessages={conversationContext.messages}
            researchAnswers={conversationContext.researchAnswers}
            refinementProgress={conversationContext.refinementProgress}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ResearchContext;
