
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
    <div className="bg-white py-2 px-4 border-b flex items-center">
      <h2 className="text-[1rem] font-bold">プレビュー</h2>
    </div>
  );
};
