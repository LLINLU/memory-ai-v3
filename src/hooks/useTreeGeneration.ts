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
  mode?: string;
}

export const useTreeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [trees, setTrees] = useState<SavedTree[]>([]);
  const [treesLoading, setTreesLoading] = useState(false);
  const [pollingTreeId, setPollingTreeId] = useState<string | null>(null);
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
        mode === "FAST" ? "generate-tree-fast" : "generate-tree-v2";

      // Get team_id from user details
      const team_id = userDetails?.team_id;

      // Both FAST and TED modes now use simplified single-call approach
      const requestBody = { searchTheme, team_id };

      // Supabase is available, use the edge function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody,
      });

      if (error) {
        console.error("Edge Function error details:", error);
        throw new Error(
          `Edge Function error: ${error.message || "Unknown error"}`
        );
      }

      if (!data) {
        throw new Error("No data returned from Edge Function");
      } // For TED v2, start polling for subtree completion
      if (mode === "TED" && data.treeId) {
        setPollingTreeId(data.treeId);
        // For TED mode with background processing, create a placeholder tree structure
        if (data.status === "generating") {
          const placeholderTreeStructure = {
            root: {
              id: "root",
              content: `Search Theme: ${searchTheme}`,
              level: 0,
              children:
                data.scenarios?.map((scenario: any) => ({
                  id: scenario.id,
                  content: scenario.name,
                  level: 1,
                  children: [], // Empty children for scenarios being generated
                })) || [],
            },
            reasoning: `Generated TED tree for: ${searchTheme}`,
            layer_config: ["Scenario", "Purpose", "Function", "Measure"],
            scenario_inputs: {
              what: null,
              who: null,
              where: null,
              when: null,
            },
          };

          const modeLabel = "TED（ニーズ深掘り）";
          toast({
            title: "ツリー生成開始",
            description: `「${searchTheme}」の${modeLabel}ツリーが生成開始されました。シナリオの詳細を生成中...`,
          });

          return {
            success: true,
            treeId: data.treeId,
            treeStructure: placeholderTreeStructure,
            mode: "TED",
            status: "generating",
          } as any; // Use any to avoid type issues for now
        }
      }
      const modeLabel =
        mode === "FAST" ? "FAST（シーズ深掘り）" : "TED（ニーズ深掘り）";

      // Handle different completion states
      let completionMessage;
      if (mode === "TED" && data.status === "generating") {
        // Don't show completion toast here, it was already shown above
        completionMessage = null;
      } else if (mode === "TED") {
        completionMessage = `「${searchTheme}」の${modeLabel}ツリーが生成開始されました。シナリオの詳細を生成中...`;
      } else {
        completionMessage = `「${searchTheme}」の${modeLabel}ツリーが生成されました`;
      }

      if (completionMessage) {
        toast({
          title: mode === "TED" ? "ツリー生成開始" : "ツリー生成完了",
          description: completionMessage,
        });
      }

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

  // Function to check if all scenarios have completed subtree generation
  const checkScenarioCompletion = useCallback(async (treeId: string) => {
    try {
      // Try multiple approaches to get fresh data

      // Approach 1: Standard query with fresh timestamp
      const { data: scenarios, error } = await supabase
        .from("tree_nodes")
        .select("id, children_count, name, updated_at")
        .eq("tree_id", treeId)
        .eq("level", 1)
        .order("updated_at", { ascending: false }); // Order by updated_at to get freshest data first

      if (error) {
        console.error("[POLLING] Error checking scenario completion:", error);
        return {
          completed: false,
          scenarios: [],
          totalScenarios: 0,
          completedScenarios: 0,
        };
      }

      // Approach 2: Direct count of child nodes to verify the data
      const { data: childCountVerification, error: countError } = await supabase
        .from("tree_nodes")
        .select("parent_id")
        .eq("tree_id", treeId)
        .in("level", [2, 3, 4]); // Children of level 1 scenarios

      if (!countError && childCountVerification) {
        const childrenByParent = childCountVerification.reduce((acc, node) => {
          if (node.parent_id) {
            acc[node.parent_id] = (acc[node.parent_id] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

      }

      // Approach 3: Force a connection refresh by making a simple query first
      await supabase.from("tree_nodes").select("id").limit(1);

      const allCompleted =
        scenarios?.every((s) => s.children_count > 0) || false;

      const result = {
        completed: allCompleted,
        scenarios: scenarios || [],
        totalScenarios: scenarios?.length || 0,
        completedScenarios:
          scenarios?.filter((s) => s.children_count > 0).length || 0,
      };

      return result;
    } catch (error) {
      console.error("[POLLING DEBUG] Error in checkScenarioCompletion:", error);
      return {
        completed: false,
        scenarios: [],
        totalScenarios: 0,
        completedScenarios: 0,
      };
    }
  }, []);

  const loadTreeFromDatabase = useCallback(
    async (treeId: string) => {
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
        if (treeData.team_id && userTeamId && treeData.team_id !== userTeamId) {
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
    },
    [userDetails]
  );
  const listSavedTrees = useCallback(async () => {
    // Prevent multiple simultaneous calls to avoid loading flicker
    if (treesLoading) {
      return trees;
    }
    if (trees.length > 0) {
      return trees;
    }
    if (userDetails === undefined || userDetails?.team_id === null) {
      return trees;
    }

    try {
      setTreesLoading(true);
      const userTeamId = userDetails?.team_id;
      if (userTeamId === null || userTeamId === undefined) {
        return trees;
      }

      // Build query to filter by team and include mode
      let query = supabase
        .from("technology_trees")
        .select("id, name, search_theme, created_at, mode")
        .order("created_at", { ascending: false });

      // If user has a team, filter by that team or trees with no team restriction
      query = query.eq("team_id", userTeamId);

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
      //console.log("List trees result:", result);
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
    if (
      userDetails !== undefined &&
      treesLoading === false &&
      trees.length === 0
    ) {
      listSavedTrees();
    }
  }, [userDetails, treesLoading, trees.length]); // Remove listSavedTrees from dependencies

  return {
    generateTree,
    loadTreeFromDatabase,
    listSavedTrees,
    checkScenarioCompletion,
    isGenerating,
    trees,
    treesLoading,
    pollingTreeId,
    setPollingTreeId,
  };
};
