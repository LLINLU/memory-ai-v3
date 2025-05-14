
import React from "react";
import { Button } from "@/components/ui/button";
import { TreemapVisualization } from "./TreemapVisualization";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleButtonClick = () => {
    try {
      // Call the provided handler to ensure proper state handling
      onGenerateResult();
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation if the handler fails
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
      </div>
      <div className="bg-white border rounded-md p-4">
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-600 mb-2">選択内容に基づく：</p>
          <p className="text-black">{selectedScenario}</p>
        </div>
        
        {/* Research areas visualization */}
        <TreemapVisualization researchAreasData={researchAreasData} />
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4C7CFC] rounded-sm"></div>
            <span>網膜イメージング（42論文）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#8D84C6] rounded-sm"></div>
            <span>波面センシング（28論文）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#A94CF7] rounded-sm"></div>
            <span>臨床応用（18論文）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4A3D78] rounded-sm"></div>
            <span>その他の分野（12論文）</span>
          </div>
        </div>
        
        {/* 検索結果へ button - ensure it triggers navigation */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full max-w-xs"
          >
            検索結果へ
          </Button>
        </div>
      </div>
    </div>
  );
};
