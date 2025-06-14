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

      // Reset scroll position
      const sidebarContent = document.querySelector('[data-sidebar="content"]');
      if (sidebarContent) {
        sidebarContent.scrollTop = 0;
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
    <div
      className="h-full p-4 overflow-auto bg-white"
      data-sidebar="content"
      style={{ paddingTop: "0" }}
    >
      <SelectedNodeInfo
        title={selectedNodeTitle}
        description={selectedNodeDescription}
      />{" "}
      <TabContent
        activeTab={activeTab}
        onValueChange={setActiveTab}
        selectedNodeId={selectedNodeId}
      />
    </div>
  );
};
