import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Edit } from "lucide-react";
interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
}
export const ScenarioSection = ({
  scenario,
  onEditScenario,
  conversationHistory = []
}: ScenarioSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get searchMode from location state - if it's not defined or is "deep", show the section
  // 'quick' mode means user came directly from home page, hide the section
  // any other mode (e.g. "deep", undefined) means user came from research-context, show the section
  const searchMode = location.state?.searchMode;
  // If searchMode is "quick", don't render the component
  if (searchMode === "quick") {
    return null;
  }
  const handleEditScenario = () => {
    // Since research-context is removed, just show an alert for now
    alert("Research context editing is not available");
  };

  // Only render if scenario exists and is not empty
  if (!scenario || scenario.trim() === "") {
    return null;
  }
  return <div className="bg-blue-50 rounded-lg p-6 mb-6 py-[12px] px-[16px]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">
            研究シナリオ：
          </h2>
          <p className="text-gray-800 mb-0 text-sm">{scenario}</p>
        </div>
        <Button onClick={handleEditScenario} variant="outline" size="sm" title="シナリオを編集" className="text-blue-600 border-blue-200 hover:bg-blue-100 h-8 w-8">
          <Edit className="h-3.5 w-3.5" />
          <span className="sr-only">シナリオを編集</span>
        </Button>
      </div>
    </div>;
};