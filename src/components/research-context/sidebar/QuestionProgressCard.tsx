
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getQuestionProgress } from "./utils/researchUtils";

interface QuestionProgressCardProps {
  refinementProgress: number;
  questionStatus: Record<string, boolean>;
}

export const QuestionProgressCard = ({ refinementProgress, questionStatus }: QuestionProgressCardProps) => {
  const questions = getQuestionProgress(questionStatus);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Clock className="h-4 w-4 mr-2 text-orange-600" />
          質問進捗状況
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">完了度</span>
            <Badge variant="secondary">{refinementProgress}%</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${refinementProgress}%` }}
            ></div>
          </div>
          
          <div className="space-y-1">
            {questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{question.label}</span>
                <span className={question.status ? "text-green-600" : "text-gray-400"}>
                  {question.status ? "✓" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
