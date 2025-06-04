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
import { toast } from "@/components/ui/use-toast";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useState, useEffect } from "react";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
}

export const RecentGeneratedTrees = () => {
  const navigate = useNavigate();
  const { listSavedTrees } = useTreeGeneration();
  const [recentTrees, setRecentTrees] = useState<SavedTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedTrees = async () => {
      try {
        setIsLoading(true);
        const trees = await listSavedTrees();
        // Take only the 5 most recent trees
        setRecentTrees(trees.slice(0, 5));
      } catch (error) {
        console.error("Error fetching saved trees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedTrees();
  }, []);

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-500" />
            最近生成されたツリー
          </CardTitle>
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

  if (recentTrees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-500" />
            最近生成されたツリー
          </CardTitle>
          <CardDescription>
            過去に生成したテクノロジーツリーから再度アクセスできます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            まだツリーが生成されていません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          最近生成されたツリー
        </CardTitle>
        <CardDescription>
          過去に生成したテクノロジーツリーから再度アクセスできます
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTrees.map((tree) => (
            <div
              key={tree.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">検索テーマ：{tree.search_theme}</h4>
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
