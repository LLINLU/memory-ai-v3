
import React from "react";
import { Button } from "@/components/ui/button";
import { TreemapVisualization } from "./TreemapVisualization";

interface ResearchArea {
  name: string;
  size: number;
  fill: string;
  papers: number;
}

interface ResearchAreasProps {
  selectedScenario: string;
  researchAreasData: ResearchArea[];
  onGenerateResult: () => void;
  researchAreasRef?: React.RefObject<HTMLDivElement>;
}

export const ResearchAreas: React.FC<ResearchAreasProps> = ({
  selectedScenario,
  researchAreasData,
  onGenerateResult,
  researchAreasRef
}) => {
  return (
    <div className="bg-white border rounded-md p-4" ref={researchAreasRef}>
      <h3 className="font-medium mb-3">潜在的な研究分野</h3>
      <div className="bg-gray-50 rounded-md p-3 mb-4">
        <p className="text-sm text-gray-600 mb-2">選択内容に基づく：</p>
        <p className="text-blue-700">{selectedScenario}</p>
      </div>
      
      {/* Research areas visualization */}
      <TreemapVisualization researchAreasData={researchAreasData} />
      
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
      
      {/* 検索結果へ button - moved outside of the section and with shorter height */}
      <div className="mt-4 flex justify-center">
        <Button
          onClick={onGenerateResult}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full max-w-xs"
        >
          検索結果へ
        </Button>
      </div>
    </div>
  );
};
