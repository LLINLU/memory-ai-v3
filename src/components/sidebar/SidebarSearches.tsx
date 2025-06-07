import { Clock, Loader2 } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTreeGeneration } from "@/hooks/useTreeGeneration";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
}

interface SearchSectionProps {
  title: string;
  searches: {
    title: string;
    treeId: string;
    isMock?: boolean;
  }[];
  onSearchClick: (treeId: string, searchTheme: string) => void;
  isLoading?: boolean;
}

function SearchSection({
  title,
  searches,
  onSearchClick,
  isLoading,
}: SearchSectionProps) {
  const { state } = useSidebar();

  return (
    state === "expanded" && (
      <>
        <div className="px-3 pt-3 text-xs font-medium text-muted-foreground">
          {title}
        </div>
        <SidebarMenu>
          {isLoading ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-gray-500">読み込み中...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : searches.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Clock className="text-gray-400" />
                <span className="text-gray-400 text-sm">履歴がありません</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            searches.map((search) => (
              <SidebarMenuItem key={search.treeId}>
                <SidebarMenuButton
                  onClick={() => onSearchClick(search.treeId, search.title)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <Clock className="text-gray-500" />
                  <span className="truncate" title={search.title}>
                    {search.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </>
    )
  );
}

export function SidebarSearches() {
  const { trees, treesLoading } = useTreeGeneration();

  const [recentSearches, setRecentSearches] = useState<
    { title: string; treeId: string; isMock?: boolean }[]
  >([]);
  const [previousSearches, setPreviousSearches] = useState<
    { title: string; treeId: string; isMock?: boolean }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Process trees data when it changes
    if (trees && Array.isArray(trees)) {
      // Convert trees to search format      // Convert trees to search format
      const searchData = trees.map((tree: SavedTree) => ({
        title: tree.search_theme,
        treeId: tree.id,
        createdAt: new Date(tree.created_at),
        isMock: false,
      }));

      // Split into recent (last 7 days) and previous
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentReal = searchData
        .filter((search) => search.createdAt > sevenDaysAgo)
        .slice(0, 5); // Show up to 5 recent searches

      const previousReal = searchData
        .filter((search) => search.createdAt <= sevenDaysAgo)
        .slice(0, 5); // Show up to 5 previous searches

      setRecentSearches(recentReal);
      setPreviousSearches(previousReal);
    } else {
      // Set empty arrays if no trees
      setRecentSearches([]);
      setPreviousSearches([]);
    }
  }, [trees]);

  const handleSearchClick = (treeId: string, searchTheme: string) => {
    navigate("/technology-tree", {
      state: {
        treeId,
        searchTheme,
        fromDatabase: true, // This is crucial for loading from database
        fromSidebar: true,
      },
    });
  };

  return (
    <>
      {" "}
      <SearchSection
        title="最近の検索"
        searches={recentSearches}
        onSearchClick={handleSearchClick}
        isLoading={treesLoading}
      />
      <SearchSection
        title="過去の検索"
        searches={previousSearches}
        onSearchClick={handleSearchClick}
        isLoading={false} // Only show loading for recent searches
      />
    </>
  );
}
