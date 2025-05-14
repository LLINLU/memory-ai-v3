
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";
import { cn } from "@/lib/utils";

interface BuildingScenarioProps {
  answers: ContextAnswers;
}

export const BuildingScenario: React.FC<BuildingScenarioProps> = ({ answers }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div 
        className="p-4 bg-[#eff6ff]"
        style={{
          borderRadius: "8px",
          borderWidth: "1px",
          borderColor: "#acc1ff"
        }}
      >
        <h3 className="text-blue-700 font-semibold mb-3">シナリオの構築</h3>
        
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-500 w-16">Who:</span>
            <span className="text-gray-800 text-[14px]">{answers.who || '...'}</span>
          </div>
          
          <div className="flex">
            <span className="text-gray-500 w-16">What:</span>
            <span className="text-gray-800 text-[14px]">{answers.what || '...'}</span>
          </div>
          
          <div className="flex">
            <span className="text-gray-500 w-16">Where:</span>
            <span className="text-gray-800 text-[14px]">{answers.where || '...'}</span>
          </div>
          
          <div className="flex">
            <span className="text-gray-500 w-16">When:</span>
            <span className="text-gray-800 text-[14px]">{answers.when || '...'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
