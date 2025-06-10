
import { SearchCard } from "./SearchCard";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
  mode?: string; // Add mode field
}

export const RecentSearches = () => {
  const { trees, treesLoading } = useTreeGeneration();
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    // Process trees data when it changes
    if (trees && Array.isArray(trees)) {
      // Convert trees to search format and take most recent 6
      const searchData = trees.slice(0, 6).map((tree: SavedTree) => ({
        title: tree.search_theme,
        paperCount: Math.floor(Math.random() * 40) + 10, // Random paper count for display
        implementationCount: Math.floor(Math.random() * 8) + 1, // Random implementation count
        tags: generateTagsFromTheme(tree.search_theme, tree.mode), // Pass mode to tag generation
        timeAgo: formatTimeAgo(tree.created_at),
        treeId: tree.id, // Store tree ID for navigation
        mode: tree.mode, // Include mode for potential future use
      }));

      setRecentSearches(searchData);
    } else {
      setRecentSearches([]);
    }
  }, [trees]);

  const generateTagsFromTheme = (theme: string, mode?: string) => {
    const keywords = theme.toLowerCase();
    const tags: { label: string; variant: string }[] = [];

    // Add mode-based tag first
    if (mode === "TED") {
      tags.push({ label: "ニーズから", variant: "blue" });
    } else if (mode === "FAST") {
      tags.push({ label: "技術から", variant: "yellow" });
    }

    // Simple keyword-based tag generation
    if (
      keywords.includes("ai") ||
      keywords.includes("機械学習") ||
      keywords.includes("深層学習")
    ) {
      tags.push({ label: "人工知能・機械学習", variant: "aiml" });
    }
    if (
      keywords.includes("医療") ||
      keywords.includes("医学") ||
      keywords.includes("バイオ")
    ) {
      tags.push({ label: "医療", variant: "healthcare" });
    }
    if (
      keywords.includes("エネルギー") ||
      keywords.includes("電力") ||
      keywords.includes("水素")
    ) {
      tags.push({ label: "エネルギー", variant: "energy" });
    }
    if (keywords.includes("材料") || keywords.includes("ナノ")) {
      tags.push({ label: "材料", variant: "materials" });
    }
    if (keywords.includes("量子") || keywords.includes("暗号")) {
      tags.push({ label: "量子技術", variant: "quantum" });
    }
    if (keywords.includes("手術") || keywords.includes("外科")) {
      tags.push({ label: "工学", variant: "engineering" });
    }

    // Default tag if no keyword matches (but mode tag might exist)
    if (tags.length === 0 || (tags.length === 1 && mode)) {
      tags.push({ label: "技術", variant: "default" });
    }

    return tags;
  };

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
        <h2 className="text-[1.2rem] font-bold mb-6">最近の検索</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          読み込み中...
        </div>
      </section>
    );
  }

  if (recentSearches.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-[1.2rem] font-bold mb-6">最近の検索</h2>
        <div className="text-center py-8 text-gray-500">
          まだ検索履歴がありません
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-[1.2rem] font-bold mb-6">最近の検索</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentSearches.map((search, index) => (
          <SearchCard key={index} {...search} />
        ))}
      </div>
    </section>
  );
};
