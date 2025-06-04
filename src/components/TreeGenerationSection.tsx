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
    "脳神経外科における低侵襲手術技術",
    "持続可能なエネルギー貯蔵システム",
    "量子暗号通信の実用化",
    "精密農業のためのIoTセンサー",
  ];

  return (
    <Card className="max-w-4xl mx-auto border-0">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl font-bold">AI技術ツリー生成</CardTitle>
        </div>
        <CardDescription className="text-base">
          検索テーマを入力するだけで、シナリオ→目的→機能→技術→要素技術の5階層以上のツリーを自動生成します
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
                    AIが技術ツリーを生成しています...
                  </p>
                  <p className="text-sm text-blue-700">
                    MECE原則に基づいて階層構造を構築し、各レベルで重複のない技術要素を抽出しています。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            参考例
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleThemes.map((theme, index) => (
              <button
                key={index}
                onClick={() => setSearchTheme(theme)}
                disabled={isGenerating}
                className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
