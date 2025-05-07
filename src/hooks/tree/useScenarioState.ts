
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScenarioStateProps {
  initialScenario?: string;
}

export const useScenarioState = ({ initialScenario }: ScenarioStateProps = {}) => {
  const location = useLocation();
  const locationState = location.state as { 
    query?: string; 
    scenario?: string;
    researchAnswers?: {
      who?: string;
      what?: string;
      where?: string;
      when?: string;
    };
  } | null;
  
  const defaultScenario = "アダプティブオプティクス技術の高度化を 研究者や技術者が天文学のユーザーに対して 天文台で実施し、精密な波面補正技術によって大気のゆらぎや光学的な歪みなどの状況に対応するものです。";
  
  const [scenario, setScenario] = useState(initialScenario || locationState?.scenario || defaultScenario);

  // If we get new state from navigation, update the scenario
  useEffect(() => {
    if (locationState?.scenario) {
      setScenario(locationState.scenario);
    }
  }, [locationState?.scenario]);

  const handleEditScenario = (newScenario: string) => {
    setScenario(newScenario);
  };

  return {
    scenario,
    setScenario,
    handleEditScenario,
    researchAnswers: locationState?.researchAnswers
  };
};
