import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUserDetail } from "@/hooks/useUserDetail";

interface TreeNode {
  id: string;
  content: string;
  level: number;
  children: TreeNode[];
}

interface TreeGenerationResult {
  success: boolean;
  treeId: string;
  treeStructure: {
    root: TreeNode;
    reasoning?: string;
    layer_config?: Record<string, unknown>;
    scenario_inputs?: Record<string, unknown>;
  };
}

interface SavedTree {
  id: string;
  name: string;
  search_theme: string;
  created_at: string;
}

export const useTreeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [trees, setTrees] = useState<SavedTree[]>([]);
  const [treesLoading, setTreesLoading] = useState(false);
  const { userDetails } = useUserDetail();

  const generateTree = async (
    searchTheme: string,
    mode: "TED" | "FAST" = "TED"
  ): Promise<TreeGenerationResult | null> => {
    if (!searchTheme.trim()) {
      toast({
        title: "エラー",
        description: "検索テーマを入力してください",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      // Check if Supabase and database tables are available
      const { data: healthCheck, error: healthError } = await supabase
        .from("technology_trees")
        .select("count")
        .limit(1);

      if (healthCheck === null || healthError) {
        // Database tables not available - show error instead of fallback to demo
        console.error(
          "Database not available:",
          healthError?.message || "No response"
        );
        toast({
          title: "データベースエラー",
          description: healthError?.message?.includes("does not exist")
            ? `データベーステーブルが未作成です。apply_migration.sqlをSupabaseで実行してください。`
            : `データベース接続エラー: ${
                healthError?.message || "No response"
              }`,
        });
        return null;
      } // Choose the appropriate edge function based on mode
      const functionName =
        mode === "FAST" ? "generate-tree-fast" : "generate-tree";

      // Get teamId from user details
      const teamId = userDetails?.team_id;

      // Supabase is available, use the edge function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { searchTheme, teamId },
      });

      if (error) {
        console.error("Edge Function error details:", error);
        throw new Error(
          `Edge Function error: ${error.message || "Unknown error"}`
        );
      }

      if (!data) {
        throw new Error("No data returned from Edge Function");
      }

      const modeLabel =
        mode === "FAST" ? "FAST（シーズ深掘り）" : "TED（ニーズ深掘り）";
      toast({
        title: "ツリー生成完了",
        description: `「${searchTheme}」の${modeLabel}ツリーが生成されました`,
      });

      return { ...data, mode } as TreeGenerationResult & { mode: string };
    } catch (error) {
      console.error("Tree generation error:", error);

      // Show error instead of fallback to demo mode
      toast({
        title: "生成エラー",
        description:
          error instanceof Error
            ? error.message
            : `「${searchTheme}」のツリー生成に失敗しました`,
      });

      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const loadTreeFromDatabase = async (treeId: string) => {
    try {
      // Validate UUID format
      const isValidUUID = (str: string) => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      };

      if (!isValidUUID(treeId)) {
        console.log("Invalid UUID format for tree ID:", treeId);
        toast({
          title: "無効なID",
          description: `無効なツリーID形式です: ${treeId}。正しいUUIDを提供してください。`,
        });
        return null;
      } // Load tree metadata
      const { data: treeData, error: treeError } = await supabase
        .from("technology_trees")
        .select("*")
        .eq("id", treeId)
        .single();

      if (treeError) {
        // Check if it's a table doesn't exist error
        if (treeError.message.includes("does not exist")) {
          toast({
            title: "データベース未設定",
            description:
              "データベーステーブルが作成されていません。apply_migration.sqlをSupabaseで実行してください。",
          });
          return null;
        }
        throw new Error(treeError.message);
      }

      // Check if user has access to this tree (same team or no team restriction)
      const userTeamId = userDetails?.team_id;
      if (treeData.teamId && userTeamId && treeData.teamId !== userTeamId) {
        toast({
          title: "アクセス権限エラー",
          description: "このツリーにアクセスする権限がありません。",
        });
        return null;
      } // Load all nodes for this tree
      const { data: nodesData, error: nodesError } = await supabase
        .from("tree_nodes")
        .select("*")
        .eq("tree_id", treeId)
        .order("level", { ascending: true })
        .order("node_order", { ascending: true });

      if (nodesError) {
        throw new Error(nodesError.message);
      }

      console.log("Loaded nodes from database:", nodesData?.length);

      // Reconstruct tree structure
      const nodeMap = new Map();
      nodesData.forEach((node) => {
        nodeMap.set(node.id, { ...node, children: [] });
      });

      // Build parent-child relationships
      nodesData.forEach((node) => {
        if (node.parent_id && nodeMap.has(node.parent_id)) {
          nodeMap.get(node.parent_id).children.push(nodeMap.get(node.id));
        }
      });

      // Find root node (level 0)
      const rootNode = nodesData.find((node) => node.level === 0);
      if (!rootNode) {
        throw new Error("Root node not found in database");
      }

      const treeStructure = {
        root: nodeMap.get(rootNode.id),
        reasoning: treeData.reasoning,
        layer_config: treeData.layer_config,
        scenario_inputs: treeData.scenario_inputs,
      };
      return {
        treeData,
        treeStructure,
      };
    } catch (error) {
      console.error("Load tree error:", error);
      toast({
        title: "読み込みエラー",
        description:
          error instanceof Error
            ? error.message
            : "ツリーの読み込みに失敗しました",
      });
      return null;
    }
  };
  const listSavedTrees = useCallback(async () => {
    // Prevent multiple simultaneous calls to avoid loading flicker
    if (treesLoading) {
      return trees;
    }
    if(trees.length > 0) {
      return trees;
    }
    if (userDetails === undefined|| userDetails.team_id === null) {
      return trees;
    }
    
    try {
      setTreesLoading(true);
      const userTeamId = userDetails?.team_id;

      // Build query to filter by team
      let query = supabase
        .from("technology_trees")
        .select("id, name, search_theme, created_at")
        .order("created_at", { ascending: false });

      // If user has a team, filter by that team or trees with no team restriction
      if (userTeamId) {
        query = query.or(`teamId.eq.${userTeamId},teamId.is.null`);
      } else {
        // If user has no team, only show trees with no team restriction
        query = query.is("teamId", null);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Database error in listSavedTrees:", error);
        // Check if it's a table doesn't exist error
        if (error.message.includes("does not exist")) {
          console.log("Database tables not set up, returning empty array");
          setTrees([]);
          return [];
        }
        throw new Error(error.message);
      }

      const result = data || [];
      setTrees(result);
      return result;
    } catch (error) {
      console.error("List trees error:", error);
      toast({
        title: "一覧取得エラー",
        description:
          error instanceof Error
            ? error.message
            : "ツリー一覧の取得に失敗しました",
      });
      setTrees([]);
      return [];
    } finally {
      setTreesLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails !== undefined && treesLoading === false && trees.length === 0) {
      listSavedTrees();
    }
  }, [userDetails, treesLoading, trees.length]); // Remove listSavedTrees from dependencies

      return {
      generateTree,
      loadTreeFromDatabase,
      listSavedTrees,
      isGenerating,
      trees,
      treesLoading,
    };
};
