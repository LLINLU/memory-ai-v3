
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { getResearchObjective } from "./utils/researchUtils";

interface ResearchObjectiveCardProps {
  query: string;
  researchAnswers: Record<string, string>;
}

export const ResearchObjectiveCard = ({ query, researchAnswers }: ResearchObjectiveCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Target className="h-4 w-4 mr-2 text-blue-600" />
          研究目的の要約
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">
          {getResearchObjective(query, researchAnswers)}
        </p>
      </CardContent>
    </Card>
  );
};
