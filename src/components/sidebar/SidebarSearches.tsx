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
import { level1Items } from "@/data/technologyTreeData";
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
    isPreset?: boolean;
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
                className={`hover:bg-gray-100 cursor-pointer ${
                  search.isPreset
                    ? "border-l-2 border-l-green-200 bg-green-50/30 hover:bg-green-50/50"
                    : ""
                }`}
              >
                <Clock
                  className={
                    search.isPreset ? "text-green-500" : "text-gray-500"
                  }
                />
                <span
                  className={`truncate ${
                    search.isPreset ? "text-green-700 font-medium" : ""
                  }`}
                  title={
                    search.isPreset
                      ? `${search.title} (プリセット技術ツリー)`
                      : search.title
                  }
                >
                  {search.title}
                  {search.isPreset && (
                    <span className="text-xs ml-1 text-green-600 font-bold">
                      ✓
                    </span>
                  )}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </>
  );
}

export function SidebarSearches() {
  const { listSavedTrees } = useTreeGeneration();

  // Create actual tree data from technology tree data
  const technologyTreeSearches = level1Items.map((item) => ({
    title: item.name,
    treeId: item.id,
    isMock: false,
    isPreset: true, // Flag to indicate this is a preset technology tree
  }));

  // Split the technology trees into recent and previous for better organization
  const recentTechTrees = technologyTreeSearches.slice(0, 3);
  const previousTechTrees = technologyTreeSearches.slice(3);

  // Initialize with technology tree data
  const [recentSearches, setRecentSearches] =
    useState<
      { title: string; treeId: string; isMock?: boolean; isPreset?: boolean }[]
    >(recentTechTrees);
  const [previousSearches, setPreviousSearches] =
    useState<
      { title: string; treeId: string; isMock?: boolean; isPreset?: boolean }[]
    >(previousTechTrees);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        setIsLoading(true);
        const trees = await listSavedTrees();

        // Ensure trees is an array
        const validTrees = Array.isArray(trees) ? trees : [];
        console.log("Fetched trees:", validTrees.length, validTrees);

        // Convert trees to search format
        const searchData = validTrees.map((tree: SavedTree) => ({
          title: tree.search_theme,
          treeId: tree.id,
          createdAt: new Date(tree.created_at),
          isMock: false,
          isPreset: false,
        }));

        // Split into recent (last 7 days) and previous
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentReal = searchData
          .filter((search) => search.createdAt > sevenDaysAgo)
          .slice(0, 2); // Limit to 2 most recent to leave room for preset trees

        const previousReal = searchData
          .filter((search) => search.createdAt <= sevenDaysAgo)
          .slice(0, 2); // Limit to 2 previous to leave room for preset trees

        // Combine real data with preset technology trees
        const combinedRecent = [
          ...recentReal,
          ...recentTechTrees.slice(0, Math.max(1, 5 - recentReal.length)),
        ];
        const combinedPrevious = [
          ...previousReal,
          ...previousTechTrees.slice(0, Math.max(1, 5 - previousReal.length)),
        ];

        console.log(
          "Recent Real:",
          recentReal.length,
          "Recent Combined:",
          combinedRecent.length
        );
        console.log(
          "Previous Real:",
          previousReal.length,
          "Previous Combined:",
          combinedPrevious.length
        );
        console.log(
          "Preset trees in recent:",
          combinedRecent.filter((item) => item.isPreset)
        );
        console.log(
          "Preset trees in previous:",
          combinedPrevious.filter((item) => item.isPreset)
        );

        setRecentSearches(combinedRecent);
        setPreviousSearches(combinedPrevious);
      } catch (error) {
        console.error("Error fetching searches:", error);
        // Fallback to only preset technology tree data on error
        console.log("Falling back to preset technology trees only");
        setRecentSearches(recentTechTrees);
        setPreviousSearches(previousTechTrees);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearches();
  }, []);

  const handleSearchClick = (treeId: string, searchTheme: string) => {
    console.log("handleSearchClick called:", { treeId, searchTheme });

    // Check if this is a preset technology tree
    const isPresetTree = level1Items.some((item) => item.id === treeId);

    if (isPresetTree) {
      console.log(
        "Preset technology tree clicked, navigating to technology tree page"
      );
      navigate("/technology-tree", {
        state: {
          treeId,
          searchTheme,
          fromPreset: true, // This indicates it's a preset tree
          fromSidebar: true,
        },
      });
      return;
    }

    // Navigate to the technology tree page with the tree data
    console.log("Real tree data clicked, navigating to technology tree page");
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
      <SearchSection
        title="最近の検索"
        searches={recentSearches}
        onSearchClick={handleSearchClick}
        isLoading={isLoading}
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
