
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { ExplorationIcon } from "./icons/ExplorationIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SuggestionProps {
  label: string;
  onClick: (query: string) => void;
}

const SearchSuggestion = ({ label, onClick }: SuggestionProps) => {
  return (
    <button 
      className="bg-white hover:bg-gray-50 rounded-full px-4 py-1 text-gray-700 transition-colors text-sm border border-gray-200"
      onClick={() => onClick(label)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none" className="inline-block mr-1.5">
        <path d="M11.1765 0H0.823529C0.605116 0 0.395648 0.113197 0.241206 0.31469C0.0867645 0.516183 0 0.789465 0 1.07442V12.1256C0 12.4105 0.0867645 12.6838 0.241206 12.8853C0.395648 13.0868 0.605116 13.2 0.823529 13.2H11.1765C11.3949 13.2 11.6044 13.0868 11.7588 12.8853C11.9132 12.6838 12 12.4105 12 12.1256V1.07442C12 0.789465 11.9132 0.516183 11.7588 0.31469C11.6044 0.113197 11.3949 0 11.1765 0ZM11.2941 12.1256C11.2941 12.1663 11.2817 12.2053 11.2597 12.2341C11.2376 12.2629 11.2077 12.2791 11.1765 12.2791H0.823529C0.792327 12.2791 0.762403 12.2629 0.74034 12.2341C0.718277 12.2053 0.705882 12.1663 0.705882 12.1256V1.07442C0.705882 1.03371 0.718277 0.99467 0.74034 0.965886C0.762403 0.937101 0.792327 0.92093 0.823529 0.92093H11.1765C11.2077 0.92093 11.2376 0.937101 11.2597 0.965886C11.2817 0.99467 11.2941 1.03371 11.2941 1.07442V12.1256ZM9.17647 4.14419C9.17647 4.26631 9.13929 4.38343 9.0731 4.46978C9.00691 4.55614 8.91714 4.60465 8.82353 4.60465H3.17647C3.08286 4.60465 2.99309 4.55614 2.9269 4.46978C2.86071 4.38343 2.82353 4.26631 2.82353 4.14419C2.82353 4.02206 2.86071 3.90494 2.9269 3.81859C2.99309 3.73223 3.08286 3.68372 3.17647 3.68372H8.82353C8.91714 3.68372 9.00691 3.73223 9.0731 3.81859C9.13929 3.90494 9.17647 4.02206 9.17647 4.14419ZM9.17647 6.6C9.17647 6.72212 9.13929 6.83924 9.0731 6.9256C9.00691 7.01195 8.91714 7.06046 8.82353 7.06046H3.17647C3.08286 7.06046 2.99309 7.01195 2.9269 6.9256C2.86071 6.83924 2.82353 6.72212 2.82353 6.6C2.82353 6.47788 2.86071 6.36076 2.9269 6.2744C2.99309 6.18805 3.08286 6.13953 3.17647 6.13953H8.82353C8.91714 6.13953 9.00691 6.18805 9.0731 6.2744C9.13929 6.36076 9.17647 6.47788 9.17647 6.6ZM9.17647 9.05581C9.17647 9.17794 9.13929 9.29506 9.0731 9.38141C9.00691 9.46777 8.91714 9.51628 8.82353 9.51628H3.17647C3.08286 9.51628 2.99309 9.46777 2.9269 9.38141C2.86071 9.29506 2.82353 9.17794 2.82353 9.05581C2.82353 8.93369 2.86071 8.81657 2.9269 8.73022C2.99309 8.64386 3.08286 8.59535 3.17647 8.59535H8.82353C8.91714 8.59535 9.00691 8.64386 9.0731 8.73022C9.13929 8.81657 9.17647 8.93369 9.17647 9.05581Z" fill="#9F9F9F"/>
      </svg>
      {label}
    </button>
  );
};

export const SearchSection = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchMode, setSearchMode] = useState("quick"); // Default to "quick"
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('/research-context', { 
        state: { 
          query: searchValue,
          searchMode: searchMode
        } 
      });
    }
  };

  const handleSuggestionClick = (query: string) => {
    navigate('/research-context', { 
      state: { 
        query,
        searchMode: searchMode
      } 
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };

  const quickExplorationSuggestions = [
    "心筋梗塞の新たな予防法は？",
    "量子コンピューティングの医療応用",
    "持続可能な農業技術のトレンド"
  ];

  const deepRefinerSuggestions = [
    "認知症患者のためのAIアシスト型リハビリテーションの効果を地域の高齢者施設で検証したい",
    "北海道の小規模農家向けに気候変動に適応した持続可能な作物栽培方法を研究しています",
    "製薬企業の研究者として、副作用の少ない抗がん剤の開発に必要な分子標的の特定を目指しています"
  ];

  const currentSuggestions = searchMode === "quick" 
    ? quickExplorationSuggestions 
    : deepRefinerSuggestions;

  return (
    <div className="bg-white p-8 rounded-3xl max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">研究情報を俯瞰する</h1>
      
      <div className="w-full mx-auto mb-8">
        <div className="bg-gray-50 rounded-2xl p-4">
          <Input 
            type="text" 
            placeholder={searchMode === "deep" ? 
              "例：肝細胞がん患者のAI支援画像診断を用いた早期診断精度向上を目指し、診断から3ヶ月以内の症例を対象とした研究を行いたい" : 
              "例：補償光学の眼科分野への利用"}
            className="w-full px-4 py-3 text-lg border-none bg-gray-50 focus-visible:ring-0 placeholder:text-gray-400 truncate"
            value={searchValue}
            onChange={handleSearchChange}
          />
          
          <div className="flex mt-2 items-center">
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      onClick={() => handleSearchModeChange("quick")}
                      className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                        searchMode === "quick" ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                      }`}
                    >
                      <ExplorationIcon className={`mr-1 ${searchMode === "quick" ? "stroke-[2.5px]" : ""}`} />
                      Quick Exploration
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">早期探索フェーズ向け：特定の研究文脈がなくても、キーワードから関連技術や新興トレンドを発見できます。女性ホルモンのような一般的なキーワードから始めて、幅広い可能性を探索できます。</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      onClick={() => handleSearchModeChange("deep")}
                      className={`inline-flex items-center rounded-full py-1 px-4 h-[28px] text-sm transition-colors ${
                        searchMode === "deep" ? "bg-blue-100 text-blue-600" : "bg-gray-200 hover:bg-gray-300 text-[#9f9f9f]"
                      }`}
                    >
                      <Search className={`h-3 w-3 mr-1 ${searchMode === "deep" ? "stroke-[2.5px]" : ""}`} /> Deep Refiner
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">具体的な研究文脈や仮説がある場合に最適：研究者、対象、環境、手法、目的などの詳細を入力することで、的確な研究内容に絞り込めます。その後、システムの質問に答えることでさらに研究コンテキストを洗練させ、無関係な情報を排除した効率的な探索ができます。</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="ml-auto">
              <Button
                onClick={handleSubmit}
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchValue.trim()}
              >
                <ArrowUp className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 justify-center">
        <span className="text-gray-600 text-sm">試してみる：</span>
        <div className="flex gap-2 flex-wrap">
          {currentSuggestions.map((suggestion, index) => (
            <SearchSuggestion 
              key={index} 
              label={suggestion} 
              onClick={handleSuggestionClick} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
