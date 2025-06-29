import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables:', {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });
}

interface GenerateTreeWithContextParams {
  searchTheme: string;
  context: string;
  treeMode: "TED" | "FAST";
  teamId?: string;
  treeId?: string;
}

interface TreeGenerationResponse {
  success: boolean;
  treeId?: string;
  message?: string;
  scenarios?: Array<{ id: string; name: string }>;
  implementations?: Array<{ id: string; name: string }>;
  status?: string;
  error?: string;
}

/**
 * Generate a new tree with additional context using the appropriate edge function
 */
export async function generateTreeWithContext({
  searchTheme,
  context,
  treeMode,
  teamId,
  treeId,
}: GenerateTreeWithContextParams): Promise<TreeGenerationResponse> {
  try {
    // Check for required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase configuration. Please check your environment variables.');
    }

    // Determine which edge function to call based on tree mode
    const edgeFunctionName = treeMode === "FAST" ? "generate-tree-fast-v3" : "generate-tree-v3";
    
    console.log(`[TREE_GENERATION] Calling ${edgeFunctionName} with context:`, {
      searchTheme,
      context,
      treeMode,
      teamId,
      treeId,
    });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.functions.invoke(edgeFunctionName, {
      body: {
        searchTheme,
        context,
        team_id: teamId,
        treeId,
      },
    });

    if (error) {
      console.error(`[TREE_GENERATION] Edge function error:`, error);
      throw new Error(`Failed to generate tree: ${error.message}`);
    }

    if (!data?.success) {
      console.error(`[TREE_GENERATION] Generation failed:`, data);
      throw new Error(data?.error || "Tree generation failed");
    }

    console.log(`[TREE_GENERATION] Success:`, data);
    
    return {
      success: true,
      treeId: data.treeId,
      message: data.message,
      scenarios: data.scenarios,
      implementations: data.implementations,
      status: data.status,
    };
  } catch (error) {
    console.error(`[TREE_GENERATION] Error:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check if the tree generation is complete by checking scenario completion status
 */
export async function checkTreeGenerationStatus(treeId: string): Promise<{
  isComplete: boolean;
  completedCount: number;
  totalCount: number;
  scenarios?: Array<{ id: string; name: string; children_count: number }>;
}> {
  try {
    // Check for required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase configuration. Please check your environment variables.');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('tree_nodes')
      .select('id, name, children_count')
      .eq('tree_id', treeId)
      .eq('level', 1) // Get scenario nodes
      .order('node_order');

    if (error) {
      console.error(`[TREE_STATUS] Error checking tree status:`, error);
      throw error;
    }

    const scenarios = data || [];
    const totalCount = scenarios.length;
    const completedCount = scenarios.filter(scenario => scenario.children_count > 0).length;
    const isComplete = completedCount === totalCount && totalCount > 0;

    console.log(`[TREE_STATUS] Tree ${treeId} status:`, {
      isComplete,
      completedCount,
      totalCount,
      scenarios: scenarios.map(s => ({ ...s, isComplete: s.children_count > 0 })),
    });

    return {
      isComplete,
      completedCount,
      totalCount,
      scenarios,
    };
  } catch (error) {
    console.error(`[TREE_STATUS] Error:`, error);
    return {
      isComplete: false,
      completedCount: 0,
      totalCount: 0,
    };
  }
}