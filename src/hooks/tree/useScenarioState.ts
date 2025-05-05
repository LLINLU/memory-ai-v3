
import { useState } from "react";

interface ScenarioStateProps {
  initialScenario?: string;
}

export const useScenarioState = ({ initialScenario }: ScenarioStateProps = {}) => {
  const defaultScenario = "Advancing adaptive optics technology to address challenges in astronomy, biomedicine, and defense applications";
  
  const [scenario, setScenario] = useState(initialScenario || defaultScenario);

  const handleEditScenario = (newScenario: string) => {
    setScenario(newScenario);
  };

  return {
    scenario,
    setScenario,
    handleEditScenario
  };
};
