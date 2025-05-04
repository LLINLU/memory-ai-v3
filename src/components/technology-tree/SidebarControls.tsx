
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface SidebarControlsProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  toggleSidebar: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  selectedNodeTitle?: string;
}

export const SidebarControls = ({
  toggleSidebar,
  isExpanded,
  toggleExpand,
  selectedNodeTitle
}: SidebarControlsProps) => {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <h2 className="text-xl font-bold">{selectedNodeTitle || "Results"}</h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
