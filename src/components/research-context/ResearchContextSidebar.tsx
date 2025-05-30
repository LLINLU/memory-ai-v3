
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Layers, CheckCircle, Clock, ArrowRight, BookOpen, Zap, Search, TrendingUp } from "lucide-react";

interface ResearchContextSidebarProps {
  query: string;
  conversationMessages: Array<{
    content: string;
    isUser: boolean;
  }>;
  researchAnswers: Record<string, string>;
  refinementProgress: number;
  confidenceLevels?: Record<string, number>;
  questionStatus?: Record<string, boolean>;
}

export const ResearchContextSidebar = ({ 
  query, 
  conversationMessages, 
  researchAnswers, 
  refinementProgress,
  confidenceLevels = {},
  questionStatus = {}
}: ResearchContextSidebarProps) => {
  
  const getResearchObjective = () => {
    const focus = researchAnswers.focus;
    const purpose = researchAnswers.purpose;
    
    if (focus && purpose) {
      const focusText = focus === "technical" ? "技術的な仕組み・原理" : "市場応用・実用化";
      return `${query}について、${focusText}の観点から「${purpose}」を目的とした研究`;
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

  const getTreemapImpact = () => {
    const impacts = [];
    if (researchAnswers.focus === "technical") {
      impacts.push("技術特許・論文に重点配置");
      impacts.push("実装方法・アルゴリズムの詳細表示");
      impacts.push("基礎理論から応用技術への階層構造");
    } else if (researchAnswers.focus === "market") {
      impacts.push("市場分析・商用事例に重点配置");
      impacts.push("企業動向・投資情報の表示");
      impacts.push("商用化から技術開発への逆算構造");
    }
    
    if (researchAnswers.depth === "基礎研究") {
      impacts.push("理論的基盤を深く展開");
    } else if (researchAnswers.depth === "応用研究") {
      impacts.push("実用化技術を中心に展開");
    }
    
    if (researchAnswers.targetField) {
      impacts.push(`${researchAnswers.targetField}関連技術を優先表示`);
    }
    
    return impacts;
  };

  const getQuestionProgress = () => {
    const questions = [
      { key: "focus", label: "研究焦点", status: questionStatus.focus },
      { key: "purpose", label: "研究目的", status: questionStatus.purpose },
      { key: "depth", label: "研究深度", status: questionStatus.depth },
      { key: "targetField", label: "対象分野", status: questionStatus.targetField },
      { key: "expectedOutcome", label: "期待成果", status: questionStatus.expectedOutcome },
      { key: "applications", label: "応用領域", status: questionStatus.applications }
    ];
    
    return questions;
  };

  const getRecentConversationTopics = () => {
    return conversationMessages
      .filter(msg => msg.isUser)
      .slice(-3)
      .map(msg => msg.content.substring(0, 60) + (msg.content.length > 60 ? "..." : ""));
  };

  const getGranularityPreview = () => {
    let granularity = "標準";
    let depth = "中程度";
    
    if (researchAnswers.depth === "基礎研究") {
      granularity = "高精細";
      depth = "深層";
    } else if (researchAnswers.depth === "応用研究") {
      granularity = "実用重視";
      depth = "実装寄り";
    }
    
    return { granularity, depth };
  };

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">研究コンテキスト</h2>
          <p className="text-sm text-gray-600">リアルタイム会話分析による研究詳細化</p>
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
                コンテキスト詳細
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getContextDetails().map((detail, index) => {
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
        )}

        {/* Question Progress */}
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
                {getQuestionProgress().map((question, index) => (
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

        {/* Treemap Granularity Preview */}
        {Object.keys(researchAnswers).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Search className="h-4 w-4 mr-2 text-purple-600" />
                ツリーマップ粒度予測
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-xs text-gray-600">粒度</div>
                    <div className="text-sm font-medium">{getGranularityPreview().granularity}</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-xs text-gray-600">深度</div>
                    <div className="text-sm font-medium">{getGranularityPreview().depth}</div>
                  </div>
                </div>
                
                {getTreemapImpact().length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 mb-2">予想される影響:</p>
                    {getTreemapImpact().slice(0, 3).map((impact, index) => (
                      <div key={index} className="text-xs text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {impact}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treemap Impact */}
        {getTreemapImpact().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                技術ツリーへの影響
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-2">
                  収集されたコンテキストに基づく最適化:
                </p>
                {getTreemapImpact().map((impact, index) => (
                  <div key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {impact}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Conversation Topics */}
        {getRecentConversationTopics().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
                収集済み回答
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-2">
                  最近のトピック:
                </p>
                {getRecentConversationTopics().map((topic, index) => (
                  <div key={index} className="text-xs text-gray-700 bg-gray-100 rounded p-2">
                    {topic}
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
