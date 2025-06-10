
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TreePine, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
}

export const RecentGeneratedTrees = () => {
  const navigate = useNavigate();
  const { trees, treesLoading } = useTreeGeneration();

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
        {" "}
        <div className="space-y-3">
          {trees.map((tree) => (
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
      </CardContent>
    </Card>
  );
};
