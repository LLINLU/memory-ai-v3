
import { useEffect } from "react";

interface NodeSelectionEffectProps {
  selectedPath: {
    level3: string;
  };
  setShowSidebar: (show: boolean) => void;
  setSidebarTab: (tab: string) => void;
}

export const useNodeSelectionEffect = ({
  selectedPath,
  setShowSidebar,
  setSidebarTab
}: NodeSelectionEffectProps) => {
  // Effect to handle node selection and sidebar display
  useEffect(() => {
    if (selectedPath.level3) {
      setShowSidebar(true);
      setSidebarTab("result");
      
      // Dispatch an event to refresh paper list with the selected node
      const event = new CustomEvent('refresh-papers', {
        detail: { nodeId: selectedPath.level3 }
      });
      document.dispatchEvent(event);
    }
  }, [selectedPath.level3, setShowSidebar, setSidebarTab]);
};
