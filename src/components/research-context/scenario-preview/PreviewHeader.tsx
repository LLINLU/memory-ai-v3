
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleGenerateResult = () => {
    if (onGenerateResult) {
      onGenerateResult();
    } else if (selectedScenario) {
      // Direct navigation if no handler is provided
      navigate('/technology-tree', {
        state: {
          scenario: selectedScenario
        }
      });
    }
  };

  return (
    <div className="bg-white p-4 border-b flex justify-between items-center">
      <h2 className="text-[1rem] font-bold">プレビュー</h2>
      {showGenerateButton && (
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleGenerateResult}
          className={`bg-[#2563eb] hover:bg-[#1d4ed8] transition-opacity duration-300 ${isResearchAreaVisible ? 'opacity-0' : 'opacity-100'}`}
          disabled={!selectedScenario} // Disable button if no scenario is selected
        >
          検索結果へ
        </Button>
      )}
    </div>
  );
};
