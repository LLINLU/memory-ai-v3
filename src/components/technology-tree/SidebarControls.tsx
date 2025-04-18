
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface SidebarControlsProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  toggleSidebar: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
}

export const SidebarControls = ({
  sidebarTab,
  setSidebarTab,
  toggleSidebar,
  isExpanded,
  toggleExpand,
}: SidebarControlsProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 h-12">
      <div className="flex flex-1 relative">
        <button
          onClick={() => setSidebarTab("result")}
          className={`flex-1 h-full font-medium text-center px-4 relative ${
            sidebarTab === 'result' 
              ? 'text-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setSidebarTab("chat")}
          className={`flex-1 h-full font-medium text-center px-4 relative ${
            sidebarTab === 'chat' 
              ? 'text-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Chat
        </button>
      </div>
      <div className="flex items-center gap-2 mr-2">
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
