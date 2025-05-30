
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Layers, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface ResearchContextSidebarProps {
  query: string;
  conversationMessages: Array<{
    content: string;
    isUser: boolean;
  }>;
  researchAnswers: Record<string, string>;
  refinementProgress: number;
}

export const ResearchContextSidebar = ({ 
  query, 
  conversationMessages, 
  researchAnswers, 
  refinementProgress 
}: ResearchContextSidebarProps) => {
  
  const getResearchObjective = () => {
    const focus = researchAnswers.focus;
    const purpose = researchAnswers.purpose;
    
    if (focus && purpose) {
      const focusText = focus === "technical" ? "技術的な仕組み・原理" : "市場応用・実用化";
      return `${query}について、${focusText}の観点から${purpose}を目的とした研究`;
    } else if (focus) {
      const focusText = focus === "technical" ? "技術的な仕組み・原理" : "市場応用・実用化";
      return `${query}について、${focusText}の観点からの研究`;
    }
    return `${query}に関する研究`;
  };

  const getContextDetails = () => {
    const details = [];
    if (researchAnswers.focus) {
      details.push({
        label: "研究の焦点",
        value: researchAnswers.focus === "technical" ? "技術的メカニズム" : "市場応用",
        icon: Target
      });
    }
    if (researchAnswers.purpose) {
      details.push({
        label: "目的",
        value: researchAnswers.purpose,
        icon: Users
      });
    }
    if (researchAnswers.depth) {
      details.push({
        label: "研究の深さ",
        value: researchAnswers.depth,
        icon: Layers
      });
    }
    return details;
  };

  const getTreemapImpact = () => {
    const impacts = [];
    if (researchAnswers.focus === "technical") {
      impacts.push("技術特許・論文に重点");
      impacts.push("実装方法の詳細表示");
    } else if (researchAnswers.focus === "market") {
      impacts.push("市場分析・応用例に重点");
      impacts.push("商用化事例の表示");
    }
    
    if (researchAnswers.purpose) {
      impacts.push(`${researchAnswers.purpose}関連の技術を優先表示`);
    }
    
    return impacts;
  };

  const getQuestionsAsked = () => {
    return conversationMessages
      .filter(msg => !msg.isUser)
      .map(msg => msg.content.split('\n')[0].substring(0, 80) + (msg.content.length > 80 ? "..." : ""));
  };

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">研究コンテキスト</h2>
          <p className="text-sm text-gray-600">収集された情報に基づく研究の詳細化</p>
        </div>

        {/* Research Objective Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              研究目的の要約
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getResearchObjective()}
            </p>
          </CardContent>
        </Card>

        {/* Context Details */}
        {getContextDetails().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                収集されたコンテキスト
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getContextDetails().map((detail, index) => {
                  const IconComponent = detail.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className="h-3 w-3 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">{detail.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {detail.value}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Refinement Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-600" />
              詳細化の進捗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">完了度</span>
                <Badge variant="secondary">{refinementProgress}%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${refinementProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {refinementProgress < 50 
                  ? "基本的な情報を収集中..."
                  : refinementProgress < 80 
                  ? "詳細なコンテキストを構築中..."
                  : "技術ツリー生成の準備完了"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Treemap Impact */}
        {getTreemapImpact().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-purple-600" />
                技術ツリーへの影響
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-2">
                  収集されたコンテキストに基づき、以下の要素を重視して技術ツリーを生成します：
                </p>
                {getTreemapImpact().map((impact, index) => (
                  <div key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    {impact}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversation Summary */}
        {getQuestionsAsked().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-600" />
                会話の概要
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-2">
                  収集されたトピック:
                </p>
                {getQuestionsAsked().slice(0, 3).map((question, index) => (
                  <div key={index} className="text-xs text-gray-700 bg-gray-100 rounded p-2">
                    {question}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
