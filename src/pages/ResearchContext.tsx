
import React from "react";
import { useLocation } from "react-router-dom";
import { ConversationInterface } from "@/components/research-context/ConversationInterface";
import { TechInsightsSidebar } from "@/components/research-context/TechInsightsSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const ResearchContext = () => {
  const location = useLocation();
  const { query, searchMode } = location.state || { query: "", searchMode: "deep" };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} minSize={40}>
          <ConversationInterface query={query} searchMode={searchMode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <TechInsightsSidebar query={query} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ResearchContext;
