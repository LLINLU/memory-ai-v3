
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Edit } from "lucide-react";
import { ResearchAreas } from "../research-context/scenario-preview/ResearchAreas";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
  treemapData?: any[];
  isGeneratingTreemap?: boolean;
  treemapError?: string | null;
}

export const ScenarioSection = ({ 
  scenario = "網膜疾患を持つ医療専門家と患者が、早期発見のための非侵襲的診断方法を求める臨床環境",
  onEditScenario,
  conversationHistory = [],
  treemapData = [],
  isGeneratingTreemap = false,
  treemapError = null
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
    // Navigate to Research Context page with editing flag, current scenario and conversation history
    navigate('/research-context', { 
      state: { 
        editingScenario: true,
        currentScenario: scenario,
        savedConversationHistory: conversationHistory,
        // Preserve any existing query from the current state
        query: location.state?.query
      } 
    });
  };

  // Dummy function for onGenerateResult since we're already on technology tree
  const handleGenerateResult = () => {
    console.log("Already on technology tree page");
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-medium text-blue-600 mb-1">研究シナリオ：</h2>
            <p className="text-gray-800 text-base mb-3">{scenario}</p>
          </div>
          <Button
            onClick={handleEditScenario}
            variant="outline"
            size="sm"
            title="シナリオを編集"
            className="text-blue-600 border-blue-200 hover:bg-blue-100 h-8 w-8"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">シナリオを編集</span>
          </Button>
        </div>
      </div>
      
      {/* Show research areas if we have treemap data or are generating */}
      {(treemapData && treemapData.length > 0) || isGeneratingTreemap ? (
        <ResearchAreas 
          selectedScenario={scenario}
          researchAreasData={treemapData || []}
          onGenerateResult={handleGenerateResult}
          isGenerating={isGeneratingTreemap}
          generationError={treemapError}
        />
      ) : null}
    </div>
  );
};
