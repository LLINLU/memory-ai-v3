
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Network } from "lucide-react";

interface ViewToggleProps {
  currentView: "treemap" | "mindmap";
  onViewChange: (view: "treemap" | "mindmap") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant={currentView === "treemap" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("treemap")}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        ツリーマップ
      </Button>
      <Button
        variant={currentView === "mindmap" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("mindmap")}
        className="flex items-center gap-2"
      >
        <Network className="h-4 w-4" />
        マインドマップ
      </Button>
    </div>
  );
};
