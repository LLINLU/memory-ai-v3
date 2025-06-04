import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TreeGenerationResult {
  success: boolean;
  treeId: string;
  treeStructure: any;
}

// Demo tree structure for when Supabase is not available
const createDemoTree = (searchTheme: string) => ({
  success: true,
  treeId: `demo-${Date.now()}`,
  treeStructure: {
    name: searchTheme,
    children: [
      {
        name: "シナリオ層",
        children: [
          {
            name: `${searchTheme}の実現シナリオ`,
            children: [
              {
                name: "目的層",
                children: [
                  {
                    name: `${searchTheme}の効率化`,
                    children: [
                      {
                        name: "機能層",
                        children: [
                          {
                            name: "データ処理機能",
                            children: [
                              {
                                name: "技術層",
                                children: [
                                  { name: "機械学習アルゴリズム" },
                                  { name: "データベース技術" },
                                ],
                              },
                            ],
                          },
                          {
                            name: "ユーザーインターフェース",
                            children: [
                              {
                                name: "技術層",
                                children: [
                                  { name: "Webフロントエンド技術" },
                                  { name: "モバイルアプリ開発" },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});

export const useTreeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTree = async (
    searchTheme: string
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
      }

      // Supabase is available, use the edge function
      const { data, error } = await supabase.functions.invoke("generate-tree", {
        body: { searchTheme },
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

      toast({
        title: "ツリー生成完了",
        description: `「${searchTheme}」のテクノロジーツリーが生成されました`,
      });

      return data as TreeGenerationResult;
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
      }

      // Load tree metadata
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
      }      // Load all nodes for this tree
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

  const listSavedTrees = async () => {
    try {
      const { data, error } = await supabase
        .from("technology_trees")
        .select("id, name, search_theme, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database error in listSavedTrees:", error);
        // Check if it's a table doesn't exist error
        if (error.message.includes("does not exist")) {
          console.log("Database tables not set up, returning empty array");
          return [];
        }
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("List trees error:", error);
      toast({
        title: "一覧取得エラー",
        description:
          error instanceof Error
            ? error.message
            : "ツリー一覧の取得に失敗しました",
      });
      return [];
    }
  };

  return {
    generateTree,
    loadTreeFromDatabase,
    listSavedTrees,
    isGenerating,
  };
};
