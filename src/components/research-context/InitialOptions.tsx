
import React from "react";
import { Button } from "@/components/ui/button";

interface InitialOptionsProps {
  initialQuery: string;
  onContinue: () => void;
  onSkip: () => void;
}

export const InitialOptions: React.FC<InitialOptionsProps> = ({
  initialQuery,
  onContinue,
  onSkip,
}) => {
  return (
    <div>
      <div className="mb-8">
        <p className="text-lg">
          Hi, I can help you find research papers regarding {initialQuery || "[user's query]"}. I'll help you define your research scenario using 
          the 4W framework to build a personalized research map.
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
        <Button 
          onClick={onSkip}
          variant="outline"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};
