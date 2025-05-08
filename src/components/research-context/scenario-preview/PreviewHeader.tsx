
import React from "react";
import { Button } from "@/components/ui/button";

interface PreviewHeaderProps {
  showGenerateButton: boolean;
  isResearchAreaVisible?: boolean;
  onGenerateResult?: () => void;
  selectedScenario?: string;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  showGenerateButton,
  isResearchAreaVisible,
  onGenerateResult,
  selectedScenario
}) => {
  return (
    <div className="bg-white p-4 border-b flex justify-between items-center">
      <h2 className="text-[1rem] font-bold">プレビュー</h2>
      {showGenerateButton && !isResearchAreaVisible && (
        <Button 
          variant="default" 
          size="sm" 
          onClick={onGenerateResult}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!selectedScenario} // Disable button if no scenario is selected
        >
          検索結果へ
        </Button>
      )}
    </div>
  );
};
