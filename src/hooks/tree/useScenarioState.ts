
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScenarioStateProps {
  initialScenario?: string;
  initialSearchMode?: string;
}

export const useScenarioState = ({ initialScenario, initialSearchMode }: ScenarioStateProps = {}) => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string;
    searchMode?: string;
    researchAnswers?: {
      who?: string;
      what?: string;
      where?: string;
      when?: string;
    };
  } | null;
  
  const defaultScenario = "アダプティブオプティクス技術の高度化を 研究者や技術者が天文学のユーザーに対して 天文台で実施し、精密な波面補正技術によって大気のゆらぎや光学的な歪みなどの状況に対応するものです。";
  
  const [scenario, setScenario] = useState(initialScenario || locationState?.scenario || defaultScenario);
  const [searchMode, setSearchMode] = useState(initialSearchMode || locationState?.searchMode || "quick");

  // If we get new state from navigation, update the scenario and search mode
  useEffect(() => {
    if (locationState?.scenario) {
      setScenario(locationState.scenario);
    }
    if (locationState?.searchMode) {
      setSearchMode(locationState.searchMode);
    }
  }, [locationState?.scenario, locationState?.searchMode]);

  const handleEditScenario = (newScenario: string) => {
    setScenario(newScenario);
  };

  return {
    scenario,
    searchMode,
    setScenario,
    setSearchMode,
    handleEditScenario,
    researchAnswers: locationState?.researchAnswers
  };
};
