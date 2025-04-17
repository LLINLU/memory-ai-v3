
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarControlsProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  toggleSidebar: () => void;
}

export const SidebarControls = ({
  sidebarTab,
  setSidebarTab,
  toggleSidebar,
}: SidebarControlsProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 h-12">
      <div className="flex flex-1">
        <button
          onClick={() => setSidebarTab("result")}
          className={`flex-1 h-full font-medium text-center px-4 ${
            sidebarTab === 'result' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setSidebarTab("chat")}
          className={`flex-1 h-full font-medium text-center px-4 ${
            sidebarTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Chat
        </button>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleSidebar}
        className="mr-2"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
