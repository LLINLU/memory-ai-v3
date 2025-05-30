
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ConversationInterface } from "@/components/research-context/ConversationInterface";
import { ResearchContextSidebar } from "@/components/research-context/ResearchContextSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const ResearchContext = () => {
  const location = useLocation();
  const { query, searchMode } = location.state || { query: "", searchMode: "deep" };
  
  // Centralized conversation context state
  const [conversationContext, setConversationContext] = useState({
    query,
    messages: [],
    researchAnswers: {},
    refinementProgress: 0,
    confidenceLevels: {},
    questionStatus: {
      focus: false,
      purpose: false,
      depth: false,
      targetField: false,
      expectedOutcome: false,
      applications: false
    }
  });

  const handleContextUpdate = (newContext: any) => {
    console.log('ResearchContext received context update:', newContext);
    setConversationContext(prevContext => ({
      ...prevContext,
      ...newContext,
      messages: newContext.messages || prevContext.messages,
      researchAnswers: newContext.researchAnswers || prevContext.researchAnswers,
      refinementProgress: newContext.refinementProgress || prevContext.refinementProgress,
      confidenceLevels: newContext.confidenceLevels || prevContext.confidenceLevels,
      questionStatus: newContext.questionStatus || prevContext.questionStatus
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} minSize={40}>
          <ConversationInterface 
            query={query} 
            searchMode={searchMode}
            onContextUpdate={handleContextUpdate}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <ResearchContextSidebar 
            query={conversationContext.query}
            conversationMessages={conversationContext.messages}
            researchAnswers={conversationContext.researchAnswers}
            refinementProgress={conversationContext.refinementProgress}
            confidenceLevels={conversationContext.confidenceLevels}
            questionStatus={conversationContext.questionStatus}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ResearchContext;
