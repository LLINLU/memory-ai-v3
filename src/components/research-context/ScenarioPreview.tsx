
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContextAnswers } from "@/hooks/research-context/useConversationState";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { Treemap, Tooltip, ResponsiveContainer } from "recharts";

interface ScenarioPreviewProps {
  initialQuery: string;
  answers: ContextAnswers;
  generatedScenarios: string[];
  selectedScenario?: string;
  showScenarios: boolean;
  showGenerateButton: boolean;
  onScenarioSelect?: (scenario: string) => void;
  researchAreasRef?: React.RefObject<HTMLDivElement>;
  onGenerateResult?: () => void;
}

export const ScenarioPreview: React.FC<ScenarioPreviewProps> = ({
  initialQuery,
  answers,
  generatedScenarios,
  selectedScenario,
  showScenarios,
  showGenerateButton,
  onScenarioSelect,
  researchAreasRef,
  onGenerateResult
}) => {
  const hasAnswers = Object.values(answers).some(answer => answer.trim() !== '');
  
  // Research area data for visualization
  const researchAreasData = [
    {
      name: "Retinal Imaging",
      size: 42,
      fill: "#4D82F3", // Blue
      papers: 42
    },
    {
      name: "Wavefront Sensing",
      size: 28,
      fill: "#4ADE80", // Green
      papers: 28
    },
    {
      name: "Clinical Applications",
      size: 18,
      fill: "#A855F7", // Purple
      papers: 18
    },
    {
      name: "Other Fields",
      size: 12,
      fill: "#F59E0B", // Amber
      papers: 12
    }
  ];
  
  // Custom treemap content renderer
  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, fill, size } = props;
    
    // Don't render if dimensions are too small
    if (width < 30 || height < 30) return null;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          className="stroke-white stroke-opacity-50"
          strokeWidth={2}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          textAnchor="middle"
          fill="white"
          fontSize={width < 100 ? 12 : 16}
          fontWeight="medium"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="white"
          fontSize={width < 100 ? 14 : 18}
          fontWeight="bold"
        >
          {size}%
        </text>
      </g>
    );
  };

  // Custom tooltip for the treemap
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-600">{data.papers} 論文</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <h2 className="text-[1rem] font-bold">プレビュー</h2>
        {showGenerateButton && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onGenerateResult}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!selectedScenario} // Disable button if no scenario is selected
          >
            検索結果へ
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Building Your Scenario Section */}
        <Card className="bg-blue-50 border-blue-100">
          <div className="p-4">
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

        {/* Suggested Scenarios Section */}
        {showScenarios && (
          <>
            <div>
              <h3 className="text-xl font-semibold mb-3">研究シナリオを選択してください</h3>
              <p className="text-gray-700 mb-4">
                ご回答に基づき、以下の研究シナリオを生成しました。
                ご関心に最も近いものをお選びください。
              </p>
              
              {generatedScenarios.map((scenario, index) => (
                <div 
                  key={index} 
                  className={`mb-3 border rounded-md p-4 cursor-pointer transition-colors ${
                    selectedScenario === scenario 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => onScenarioSelect && onScenarioSelect(scenario)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={selectedScenario === scenario ? "text-blue-700" : "text-gray-800"}>
                        {scenario}
                      </p>
                      {selectedScenario === scenario ? (
                        <div className="flex items-center gap-1 text-blue-600 text-sm mt-2">
                          <Check size={16} />
                          <span>選択済み</span>
                        </div>
                      ) : (
                        <Button 
                          className="mt-3" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onScenarioSelect && onScenarioSelect(scenario);
                          }}
                        >
                          このシナリオを選択
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedScenario && (
              <div>
                <Separator className="my-4" />
                <div className="bg-white border rounded-md p-4" ref={researchAreasRef}>
                  <h3 className="font-medium mb-3">潜在的な研究分野</h3>
                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-2">選択内容に基づく：</p>
                    <p className="text-blue-700">{selectedScenario}</p>
                  </div>
                  
                  {/* Research areas visualization */}
                  <div className="aspect-video mb-4">
                    <ChartContainer 
                      className="w-full h-[270px]"
                      config={{
                        "retinal": { color: "#4D82F3" },
                        "wavefront": { color: "#4ADE80" },
                        "clinical": { color: "#A855F7" },
                        "other": { color: "#F59E0B" }
                      }}
                    >
                      <Treemap
                        data={researchAreasData}
                        dataKey="size"
                        nameKey="name"
                        fill="#8884d8"
                      >
                        <Tooltip content={<CustomTooltip />} />
                      </Treemap>
                    </ChartContainer>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span>網膜イメージング（42論文）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span>波面センシング（28論文）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                      <span>臨床応用（18論文）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                      <span>その他の分野（12論文）</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {!hasAnswers && !showScenarios && (
          <div className="flex items-center justify-center h-40 text-gray-500">
            質問に答えて研究コンテキストを構築しましょう
          </div>
        )}
      </div>
    </div>
  );
};

