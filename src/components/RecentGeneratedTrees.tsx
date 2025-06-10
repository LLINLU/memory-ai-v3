
import { TreeCard } from "./TreeCard";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
}

export const RecentGeneratedTrees = () => {
  const { trees, treesLoading } = useTreeGeneration();
  const [recentTrees, setRecentTrees] = useState<any[]>([]);

  useEffect(() => {
    // Process trees data when it changes
    if (trees && Array.isArray(trees)) {
      // Convert trees to tree format and take most recent 6
      const treeData = trees.slice(0, 6).map((tree: SavedTree) => ({
        title: tree.search_theme,
        timeAgo: formatTimeAgo(tree.created_at),
        treeId: tree.id, // Store tree ID for navigation
      }));

      setRecentTrees(treeData);
    } else {
      setRecentTrees([]);
    }
  }, [trees]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "1日前";
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  if (treesLoading) {
    return (
      <section className="mt-12">
        <h3 className="flex items-center gap-2 text-[18px]">最近の検索</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          読み込み中...
        </div>
      </section>
    );
  }

  if (recentTrees.length === 0) {
    return (
      <section className="mt-12">
        <h3 className="flex items-center gap-2 text-[18px]">最近の検索</h3>
        <div className="text-center py-8 text-gray-500">
          まだ検索履歴がありません
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h3 className="flex items-center gap-2 text-[18px]">最近の検索</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {recentTrees.map((tree, index) => (
          <TreeCard key={index} {...tree} />
        ))}
      </div>
    </section>
  );
};
