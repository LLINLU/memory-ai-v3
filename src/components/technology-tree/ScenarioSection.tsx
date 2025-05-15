
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface ScenarioSectionProps {
  scenario?: string;
  onEditScenario?: (newScenario: string) => void;
  conversationHistory?: any[];
}

export const ScenarioSection = ({ 
  scenario = "網膜疾患を持つ医療専門家と患者が、早期発見のための非侵襲的診断方法を求める臨床環境",
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

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">Current Scenario:</h2>
          <p className="text-gray-800 text-base mb-3">{scenario}</p>
        </div>
        <Button
          onClick={handleEditScenario}
          variant="outline"
          size="icon"
          title="シナリオを編集"
          className="h-10 w-10 text-blue-600 border-blue-200 hover:bg-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
          </svg>
          <span className="sr-only">シナリオを編集</span>
        </Button>
      </div>
    </div>
  );
};
