
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TechnologyTreeProvider } from "@/components/technology-tree/providers/TechnologyTreeProvider";
import { TechnologyTreeEffects } from "@/components/technology-tree/effects/TechnologyTreeEffects";
import { TechnologyTreeContent } from "@/components/technology-tree/content/TechnologyTreeContent";

const TechnologyTree = () => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string; 
    searchMode?: string;
    researchAnswers?: any;
    conversationHistory?: any[];
    tedResults?: any;
    treeData?: any;
  } | null;
  
  const [savedConversationHistory, setSavedConversationHistory] = useState<any[]>([]);
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);
  
  useEffect(() => {
    if (locationState?.conversationHistory) {
      setSavedConversationHistory(locationState.conversationHistory);
    }
  }, [locationState]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <TechnologyTreeProvider locationState={locationState}>
            <TechnologyTreeEffects
              locationState={locationState}
              savedConversationHistory={savedConversationHistory}
              setShowFallbackAlert={setShowFallbackAlert}
            />
            <TechnologyTreeContent
              savedConversationHistory={savedConversationHistory}
              showFallbackAlert={showFallbackAlert}
              setShowFallbackAlert={setShowFallbackAlert}
            />
          </TechnologyTreeProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TechnologyTree;
