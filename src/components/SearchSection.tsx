
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
      className="bg-[#f6fbff] hover:bg-gray-50 rounded-md px-4 py-1 text-gray-700 transition-colors text-sm border border-[#c4d4f4]"
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
      // If searchMode is "quick", navigate directly to technology-tree
      if (searchMode === "quick") {
        navigate('/technology-tree', { 
          state: { 
            query: searchValue,
            searchMode: searchMode
          } 
        });
      } else {
        // For "deep" mode, continue to go to research-context
        navigate('/research-context', { 
          state: { 
            query: searchValue,
            searchMode: searchMode
          } 
        });
      }
    }
  };

  const handleSuggestionClick = (query: string) => {
    // Same for suggestion clicks - go directly to technology-tree for quick mode
    if (searchMode === "quick") {
      navigate('/technology-tree', { 
        state: { 
          query,
          searchMode: searchMode
        } 
      });
    } else {
      navigate('/research-context', { 
        state: { 
          query,
          searchMode: searchMode
        } 
      });
    }
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
        <div className="bg-gray-50 rounded-2xl p-4 border border-[#ebf0f7] border-[1px]">
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
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.1374 6.74157L7.43481 5.7458L6.43904 3.04321C6.38832 2.9057 6.29667 2.78705 6.17644 2.70325C6.0562 2.61944 5.91317 2.57451 5.76661 2.57451C5.62005 2.57451 5.47702 2.61944 5.35678 2.70325C5.23655 2.78705 5.1449 2.9057 5.09418 3.04321L4.09841 5.7458L1.39582 6.74157C1.25832 6.79228 1.13967 6.88394 1.05586 7.00417C0.972055 7.1244 0.927124 7.26744 0.927124 7.414C0.927124 7.56056 0.972055 7.70359 1.05586 7.82383C1.13967 7.94406 1.25832 8.03571 1.39582 8.08643L4.09841 9.0822L5.09418 11.7848C5.1449 11.9223 5.23655 12.0409 5.35678 12.1247C5.47702 12.2086 5.62005 12.2535 5.76661 12.2535C5.91317 12.2535 6.0562 12.2086 6.17644 12.1247C6.29667 12.0409 6.38832 11.9223 6.43904 11.7848L7.43481 9.0822L10.1374 8.08643C10.2749 8.03571 10.3936 7.94406 10.4774 7.82383C10.5612 7.70359 10.6061 7.56056 10.6061 7.414C10.6061 7.26744 10.5612 7.1244 10.4774 7.00417C10.3936 6.88394 10.2749 6.79228 10.1374 6.74157ZM9.92373 7.50668L7.08778 8.55188C7.04578 8.56733 7.00763 8.59172 6.97598 8.62337C6.94433 8.65502 6.91994 8.69317 6.90449 8.73517L5.85929 11.5711C5.85227 11.59 5.83962 11.6063 5.82305 11.6179C5.80649 11.6294 5.78679 11.6356 5.76661 11.6356C5.74643 11.6356 5.72673 11.6294 5.71017 11.6179C5.6936 11.6063 5.68095 11.59 5.67393 11.5711L4.62873 8.73517C4.61328 8.69317 4.58889 8.65502 4.55724 8.62337C4.52559 8.59172 4.48744 8.56733 4.44544 8.55188L1.60949 7.50668C1.59058 7.49965 1.57426 7.48701 1.56274 7.47044C1.55121 7.45388 1.54504 7.43418 1.54504 7.414C1.54504 7.39382 1.55121 7.37412 1.56274 7.35755C1.57426 7.34099 1.59058 7.32834 1.60949 7.32132L4.44544 6.27612C4.48744 6.26067 4.52559 6.23628 4.55724 6.20463C4.58889 6.17298 4.61328 6.13483 4.62873 6.09282L5.67393 3.25688C5.68095 3.23796 5.6936 3.22165 5.71017 3.21012C5.72673 3.1986 5.74643 3.19243 5.76661 3.19243C5.78679 3.19243 5.80649 3.1986 5.82305 3.21012C5.83962 3.22165 5.85227 3.23796 5.85929 3.25688L6.90449 6.09282C6.91994 6.13483 6.94433 6.17298 6.97598 6.20463C7.00763 6.23628 7.04578 6.26067 7.08778 6.27612L9.92373 7.32132C9.94264 7.32834 9.95896 7.34099 9.97048 7.35755C9.98201 7.37412 9.98818 7.39382 9.98818 7.414C9.98818 7.43418 9.98201 7.45388 9.97048 7.47044C9.95896 7.48701 9.94264 7.49965 9.92373 7.50668ZM7.51719 2.05928C7.51719 1.97735 7.54974 1.89877 7.60767 1.84084C7.66561 1.7829 7.74418 1.75035 7.82612 1.75035H8.7529V0.823575C8.7529 0.741642 8.78544 0.663066 8.84338 0.605131C8.90131 0.547196 8.97989 0.514648 9.06182 0.514648C9.14375 0.514648 9.22233 0.547196 9.28027 0.605131C9.3382 0.663066 9.37075 0.741642 9.37075 0.823575V1.75035H10.2975C10.3795 1.75035 10.458 1.7829 10.516 1.84084C10.5739 1.89877 10.6065 1.97735 10.6065 2.05928C10.6065 2.14121 10.5739 2.21979 10.516 2.27772C10.458 2.33566 10.3795 2.36821 10.2975 2.36821H9.37075V3.29498C9.37075 3.37692 9.3382 3.45549 9.28027 3.51343C9.22233 3.57136 9.14375 3.60391 9.06182 3.60391C8.97989 3.60391 8.90131 3.57136 8.84338 3.51343C8.78544 3.45549 8.7529 3.37692 8.7529 3.29498V2.36821H7.82612C7.74418 2.36821 7.66561 2.33566 7.60767 2.27772C7.54974 2.21979 7.51719 2.14121 7.51719 2.05928ZM12.666 4.53069C12.666 4.61262 12.6334 4.6912 12.5755 4.74913C12.5175 4.80707 12.439 4.83961 12.357 4.83961H11.8422V5.35449C11.8422 5.43642 11.8096 5.515 11.7517 5.57293C11.6937 5.63087 11.6152 5.66342 11.5332 5.66342C11.4513 5.66342 11.3727 5.63087 11.3148 5.57293C11.2569 5.515 11.2243 5.43642 11.2243 5.35449V4.83961H10.7094C10.6275 4.83961 10.5489 4.80707 10.491 4.74913C10.433 4.6912 10.4005 4.61262 10.4005 4.53069C10.4005 4.44876 10.433 4.37018 10.491 4.31224C10.5489 4.25431 10.6275 4.22176 10.7094 4.22176H11.2243V3.70688C11.2243 3.62495 11.2569 3.54638 11.3148 3.48844C11.3727 3.43051 11.4513 3.39796 11.5332 3.39796C11.6152 3.39796 11.6937 3.43051 11.7517 3.48844C11.8096 3.54638 11.8422 3.62495 11.8422 3.70688V4.22176H12.357C12.439 4.22176 12.5175 4.25431 12.5755 4.31224C12.6334 4.37018 12.666 4.44876 12.666 4.53069Z" fill="#9CA8D5"/>
          </svg>
          <span className="text-gray-600 text-sm">試してみる：</span>
        </div>
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
