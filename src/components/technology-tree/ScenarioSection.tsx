import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Edit } from "lucide-react";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
  onGuidanceClick?: (type: string) => void;
  treeMode?: string;
}

export const ScenarioSection = ({
  scenario,
  onEditScenario,
  conversationHistory = [],
  onGuidanceClick,
  treeMode,
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
    // Open the AI chatbot with scenario editing conversation
    if (onGuidanceClick) {
      onGuidanceClick("scenario-editing");
    }
  };
  // Only render if scenario exists and is not empty
  if (!scenario || scenario.trim() === "") {
    return null;
  }

  // Dynamic labels based on tree mode
  const labels =
    treeMode === "FAST"
      ? {
          title: "Technology：",
          editTitle: "Technologyを編集",
          editScreenReader: "Technologyを編集",
        }
      : {
          title: "研究シナリオ：",
          editTitle: "シナリオを編集",
          editScreenReader: "シナリオを編集",
        };

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6 py-[12px] px-[16px] mt-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">
            {labels.title}
          </h2>
          <p className="text-gray-800 mb-0 text-sm">{scenario}</p>
        </div>
        <Button
          onClick={handleEditScenario}
          variant="outline"
          size="sm"
          title={labels.editTitle}
          className="text-blue-600 border-blue-200 hover:bg-blue-100 h-8 w-8"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="sr-only">{labels.editScreenReader}</span>
        </Button>
      </div>
    </div>
  );
};
