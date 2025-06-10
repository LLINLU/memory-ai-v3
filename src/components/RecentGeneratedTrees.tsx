
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TreePine, Clock, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useState } from "react";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
  mode?: string;
}

export const RecentGeneratedTrees = () => {
  const navigate = useNavigate();
  const { trees, treesLoading } = useTreeGeneration();
  const [showAll, setShowAll] = useState(false);

  const handleViewTree = (tree: SavedTree) => {
    // Navigate to tree view with real database tree
    navigate("/technology-tree", {
      state: {
        query: tree.search_theme,
        searchMode: "prompt-generated",
        treeId: tree.id,
        fromDatabase: true,
        isDemo: false,
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModeLabel = (mode?: string) => {
    switch (mode) {
      case "FAST":
        return "技術から";
      case "TED":
        return "ニーズから";
      default:
        return "ニーズから"; // Default fallback
    }
  };

  const getModeClasses = (mode?: string) => {
    switch (mode) {
      case "FAST":
        return "px-3 py-1 rounded-full text-[0.75rem] font-normal bg-purple-50 text-purple-700";
      case "TED":
        return "px-3 py-1 rounded-full text-[0.75rem] font-normal bg-blue-50 text-blue-700";
      default:
        return "px-3 py-1 rounded-full text-[0.75rem] font-normal bg-blue-50 text-blue-700"; // Default to TED styling
    }
  };

  // Determine which trees to display
  const displayedTrees = showAll ? trees : trees.slice(0, 10);
  const hasMoreTrees = trees.length > 10;

  if (treesLoading) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            最近の検索
          </CardTitle>
          <CardDescription>
            過去に生成したテクノロジーツリーから再度アクセスできます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            読み込み中...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[18px]">
          最近の検索
        </CardTitle>
        <CardDescription>
          過去に生成したテクノロジーツリーから再度アクセスできます
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedTrees.map((tree) => (
            <div
              key={tree.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">{tree.search_theme}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(tree.created_at)}
                  </div>
                  <span className={getModeClasses(tree.mode)}>
                    {getModeLabel(tree.mode)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewTree(tree)}
                className="flex items-center gap-1"
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {hasMoreTrees && !showAll && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              もっと見る
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
