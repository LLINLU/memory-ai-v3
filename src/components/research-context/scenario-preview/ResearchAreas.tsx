
import React from "react";
import { Button } from "@/components/ui/button";
import { TreemapVisualization } from "./TreemapVisualization";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
  isGenerating?: boolean;
  generationError?: string | null;
}

export const ResearchAreas: React.FC<ResearchAreasProps> = ({
  selectedScenario,
  researchAreasData,
  onGenerateResult,
  researchAreasRef,
  isGenerating = false,
  generationError
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    try {
      onGenerateResult();
    } catch (error) {
      console.error("Navigation error:", error);
      navigate('/technology-tree', {
        state: {
          scenario: selectedScenario
        }
      });
    }
  };

  return (
    <div ref={researchAreasRef}>
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm25.56-92.74L120,168h32a8,8,0,0,1,0,16H104a8,8,0,0,1-6.4-12.8l43.17-57.56a16,16,0,1,0-27.86-15,8,8,0,0,1-15.09-5.34,32,32,0,1,1,55.74,29.93Z"></path>
        </svg>
        <h3 className="font-bold">潜在的な研究分野を表示</h3>
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
      </div>
      
      <div className="bg-white border rounded-md p-4">
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-600 mb-2">選択内容に基づく：</p>
          <p className="text-black">{selectedScenario}</p>
        </div>
        
        {generationError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">エラー: {generationError}</p>
            <p className="text-red-500 text-xs mt-1">デフォルトデータを表示しています</p>
          </div>
        )}
        
        {isGenerating ? (
          <div className="flex items-center justify-center h-[270px] bg-gray-50 rounded-md">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600">研究分野を生成中...</p>
            </div>
          </div>
        ) : (
          <>
            <TreemapVisualization researchAreasData={researchAreasData} />
            
            <div className="space-y-2 text-sm">
              {researchAreasData.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: area.fill }}
                  ></div>
                  <span>{area.name}（{area.papers}論文）</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button
          onClick={handleButtonClick}
          disabled={isGenerating}
          className="bg-[#2563eb] hover:bg-blue-700 text-white w-full disabled:opacity-50"
        >
          {isGenerating ? "生成中..." : "検索結果へ"}
        </Button>
      </div>
    </div>
  );
};
