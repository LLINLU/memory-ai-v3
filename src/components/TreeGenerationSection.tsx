import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles, TreePine } from "lucide-react";

export const TreeGenerationSection = () => {
  const [searchTheme, setSearchTheme] = useState("");
  const { generateTree, isGenerating } = useTreeGeneration();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!searchTheme.trim()) return;

    const result = await generateTree(searchTheme);

    if (result) {
      // Navigate to technology tree with generated data only if successful
      navigate("/technology-tree", {
        state: {
          query: searchTheme,
          searchMode: "prompt-generated",
          treeId: result.treeId,
          treeStructure: result.treeStructure,
          fromDatabase: true,
        },
      });
    }
    // If result is null, error message is already shown by generateTree
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate();
    }
  };

  const exampleThemes = [
    "心筋梗塞の新たな予防法は？",
    "量子コンピューティングの医療応用",
    "持続可能な農業技術のトレンド"
  ];

  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl font-bold">研究情報を俯瞰する</CardTitle>
        </div>
        <CardDescription className="text-base">
          検索テーマを入力するだけで、シナリオ→目的→機能→技術の4階層以上のツリーを自動生成します
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="例：補償光学技術の医療応用"
              value={searchTheme}
              onChange={(e) => setSearchTheme(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isGenerating}
              className="text-lg py-6 pr-32"
            />
            <Button
              onClick={handleGenerate}
              disabled={!searchTheme.trim() || isGenerating}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  生成中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  ツリー生成
                </div>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <div className="space-y-1">
                  <p className="font-medium text-blue-900">
                    MECE原則に基づいて階層構造を構築し、各レベルで重複のない技術要素を抽出しています...
                  </p>
                  <p className="text-sm text-blue-700">
                    TED手法を使用して高品質な技術ツリーを生成しています...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <g clipPath="url(#clip0_219_5)">
                <path d="M10.5625 7.3125C10.5635 7.47814 10.5132 7.64003 10.4184 7.77589C10.3237 7.91175 10.1891 8.01491 10.0333 8.07117L7.41405 9.03906L6.44921 11.6604C6.39207 11.8156 6.2887 11.9496 6.15303 12.0442C6.01737 12.1388 5.85594 12.1896 5.69054 12.1896C5.52513 12.1896 5.36371 12.1388 5.22804 12.0442C5.09238 11.9496 4.989 11.8156 4.93186 11.6604L3.96093 9.03906L1.3396 8.07422C1.18438 8.01708 1.05041 7.91371 0.955787 7.77804C0.861161 7.64238 0.810425 7.48095 0.810425 7.31555C0.810425 7.15014 0.861161 6.98872 0.955787 6.85305C1.05041 6.71739 1.18438 6.61401 1.3396 6.55687L3.96093 5.58594L4.92577 2.96461C4.98291 2.80939 5.08628 2.67542 5.22195 2.5808C5.35761 2.48617 5.51904 2.43544 5.68444 2.43544C5.84985 2.43544 6.01127 2.48617 6.14694 2.5808C6.2826 2.67542 6.38598 2.80939 6.44311 2.96461L7.41405 5.58594L10.0354 6.55078C10.1913 6.60755 10.3257 6.71132 10.4201 6.84776C10.5146 6.9842 10.5643 7.14659 10.5625 7.3125ZM7.71874 2.4375H8.53124V3.25C8.53124 3.35774 8.57404 3.46108 8.65023 3.53726C8.72641 3.61345 8.82974 3.65625 8.93749 3.65625C9.04523 3.65625 9.14856 3.61345 9.22475 3.53726C9.30094 3.46108 9.34374 3.35774 9.34374 3.25V2.4375H10.1562C10.264 2.4375 10.3673 2.3947 10.4435 2.31851C10.5197 2.24233 10.5625 2.13899 10.5625 2.03125C10.5625 1.92351 10.5197 1.82017 10.4435 1.74399C10.3673 1.6678 10.264 1.625 10.1562 1.625H9.34374V0.8125C9.34374 0.704756 9.30094 0.601424 9.22475 0.525238C9.14856 0.449051 9.04523 0.40625 8.93749 0.40625C8.82974 0.40625 8.72641 0.449051 8.65023 0.525238C8.57404 0.601424 8.53124 0.704756 8.53124 0.8125V1.625H7.71874C7.61099 1.625 7.50766 1.6678 7.43148 1.74399C7.35529 1.82017 7.31249 1.92351 7.31249 2.03125C7.31249 2.13899 7.35529 2.24233 7.43148 2.31851C7.50766 2.3947 7.61099 2.4375 7.71874 2.4375ZM12.1875 4.0625H11.7812V3.65625C11.7812 3.54851 11.7384 3.44517 11.6623 3.36899C11.5861 3.2928 11.4827 3.25 11.375 3.25C11.2672 3.25 11.1639 3.2928 11.0877 3.36899C11.0115 3.44517 10.9687 3.54851 10.9687 3.65625V4.0625H10.5625C10.4547 4.0625 10.3514 4.1053 10.2752 4.18149C10.199 4.25767 10.1562 4.36101 10.1562 4.46875C10.1562 4.57649 10.199 4.67983 10.2752 4.75601C10.3514 4.8322 10.4547 4.875 10.5625 4.875H10.9687V5.28125C10.9687 5.38899 11.0115 5.49233 11.0877 5.56851C11.1639 5.6447 11.2672 5.6875 11.375 5.6875C11.4827 5.6875 11.5861 5.6447 11.6623 5.56851C11.7384 5.49233 11.7812 5.38899 11.7812 5.28125V4.875H12.1875C12.2952 4.875 12.3986 4.8322 12.4748 4.75601C12.5509 4.67983 12.5937 4.57649 12.5937 4.46875C12.5937 4.36101 12.5509 4.25767 12.4748 4.18149C12.3986 4.1053 12.2952 4.0625 12.1875 4.0625Z" fill="#9CA8D5"/>
              </g>
              <defs>
                <clipPath id="clip0_219_5">
                  <rect width="13" height="13" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-gray-600 text-sm">試してみる：</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleThemes.map((theme, index) => (
              <button
                key={index}
                onClick={() => setSearchTheme(theme)}
                disabled={isGenerating}
                className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none" className="inline-block mr-1.5">
                  <path d="M11.1765 0H0.823529C0.605116 0 0.395648 0.113197 0.241206 0.31469C0.0867645 0.516183 0 0.789465 0 1.07442V12.1256C0 12.4105 0.0867645 12.6838 0.241206 12.8853C0.395648 13.0868 0.605116 13.2 0.823529 13.2H11.1765C11.3949 13.2 11.6044 13.0868 11.7588 12.8853C11.9132 12.6838 12 12.4105 12 12.1256V1.07442C12 0.789465 11.9132 0.516183 11.7588 0.31469C11.6044 0.113197 11.3949 0 11.1765 0ZM11.2941 12.1256C11.2941 12.1663 11.2817 12.2053 11.2597 12.2341C11.2376 12.2629 11.2077 12.2791 11.1765 12.2791H0.823529C0.792327 12.2791 0.762403 12.2629 0.74034 12.2341C0.718277 12.2053 0.705882 12.1663 0.705882 12.1256V1.07442C0.705882 1.03371 0.718277 0.99467 0.74034 0.965886C0.762403 0.937101 0.792327 0.92093 0.823529 0.92093H11.1765C11.2077 0.92093 11.2376 0.937101 11.2597 0.965886C11.2817 0.99467 11.2941 1.03371 11.2941 1.07442V12.1256ZM9.17647 4.14419C9.17647 4.26631 9.13929 4.38343 9.0731 4.46978C9.00691 4.55614 8.91714 4.60465 8.82353 4.60465H3.17647C3.08286 4.60465 2.99309 4.55614 2.9269 4.46978C2.86071 4.38343 2.82353 4.26631 2.82353 4.14419C2.82353 4.02206 2.86071 3.90494 2.9269 3.81859C2.99309 3.73223 3.08286 3.68372 3.17647 3.68372H8.82353C8.91714 3.68372 9.00691 3.73223 9.0731 3.81859C9.13929 3.90494 9.17647 4.02206 9.17647 4.14419ZM9.17647 6.6C9.17647 6.72212 9.13929 6.83924 9.0731 6.9256C9.00691 7.01195 8.91714 7.06046 8.82353 7.06046H3.17647C3.08286 7.06046 2.99309 7.01195 2.9269 6.9256C2.86071 6.83924 2.82353 6.72212 2.82353 6.6C2.82353 6.47788 2.86071 6.36076 2.9269 6.2744C2.99309 6.18805 3.08286 6.13953 3.17647 6.13953H8.82353C8.91714 6.13953 9.00691 6.18805 9.0731 6.2744C9.13929 6.36076 9.17647 6.47788 9.17647 6.6ZM9.17647 9.05581C9.17647 9.17794 9.13929 9.29506 9.0731 9.38141C9.00691 9.46777 8.91714 9.51628 8.82353 9.51628H3.17647C3.08286 9.51628 2.99309 9.46777 2.9269 9.38141C2.86071 9.29506 2.82353 9.17794 2.82353 9.05581C2.82353 8.93369 2.86071 8.81657 2.9269 8.73022C2.99309 8.64386 3.08286 8.59535 3.17647 8.59535H8.82353C8.91714 8.59535 9.00691 8.64386 9.0731 8.73022C9.13929 8.81657 9.17647 8.93369 9.17647 9.05581Z" fill="#9F9F9F"/>
                </svg>
                <span>{theme}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
