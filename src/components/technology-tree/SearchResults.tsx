
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabContent } from "./components/TabContent";
import { SelectedNodeInfo } from "./components/SelectedNodeInfo";

interface SearchResultsProps {
  selectedNodeTitle?: string;
  selectedNodeDescription?: string;
  selectedNodeId?: string;
}

export const SearchResults = ({
  selectedNodeTitle,
  selectedNodeDescription,
  selectedNodeId,
}: SearchResultsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("papers");

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      console.log("SearchResults component detected refresh event:", event);

      // Reset scroll position for the papers list container
      const papersContainer = document.querySelector('[data-papers-scroll]');
      if (papersContainer) {
        papersContainer.scrollTop = 0;
      }

      // Ensure we're on the papers tab
      setActiveTab("papers");
    };

    document.addEventListener("refresh-papers", handleRefresh);

    return () => {
      document.removeEventListener("refresh-papers", handleRefresh);
    };
  }, [toast]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 p-4">
        <SelectedNodeInfo
          title={selectedNodeTitle}
          description={selectedNodeDescription}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TabContent
          activeTab={activeTab}
          onValueChange={setActiveTab}
          selectedNodeId={selectedNodeId}
        />
      </div>
    </div>
  );
};
