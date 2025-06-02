
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Layers, BookOpen, Zap, CheckCircle } from "lucide-react";

interface ContextDetailsCardProps {
  researchAnswers: Record<string, string>;
  confidenceLevels: Record<string, number>;
}

export const ContextDetailsCard = ({ researchAnswers, confidenceLevels }: ContextDetailsCardProps) => {
  const getContextDetails = () => {
    const details = [];
    if (researchAnswers.focus) {
      details.push({
        label: "研究の焦点",
        value: researchAnswers.focus === "technical" ? "技術的メカニズム" : "市場応用",
        icon: Target,
        confidence: confidenceLevels.focus || 0
      });
    }
    if (researchAnswers.purpose) {
      details.push({
        label: "研究目的",
        value: researchAnswers.purpose.length > 30 ? researchAnswers.purpose.substring(0, 30) + "..." : researchAnswers.purpose,
        icon: Users,
        confidence: confidenceLevels.purpose || 0
      });
    }
    if (researchAnswers.depth) {
      details.push({
        label: "研究の深さ",
        value: researchAnswers.depth,
        icon: Layers,
        confidence: confidenceLevels.depth || 0
      });
    }
    if (researchAnswers.targetField) {
      details.push({
        label: "対象分野",
        value: researchAnswers.targetField.length > 25 ? researchAnswers.targetField.substring(0, 25) + "..." : researchAnswers.targetField,
        icon: BookOpen,
        confidence: confidenceLevels.targetField || 0
      });
    }
    if (researchAnswers.expectedOutcome) {
      details.push({
        label: "期待成果",
        value: researchAnswers.expectedOutcome.length > 25 ? researchAnswers.expectedOutcome.substring(0, 25) + "..." : researchAnswers.expectedOutcome,
        icon: Zap,
        confidence: confidenceLevels.expectedOutcome || 0
      });
    }
    return details;
  };

  const contextDetails = getContextDetails();

  if (contextDetails.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          コンテキスト詳細
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contextDetails.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="h-3 w-3 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">{detail.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {detail.value}
                  </Badge>
                </div>
                {detail.confidence > 0 && (
                  <div className="ml-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">信頼度</span>
                      <span className="text-xs text-gray-600">{detail.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${detail.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
