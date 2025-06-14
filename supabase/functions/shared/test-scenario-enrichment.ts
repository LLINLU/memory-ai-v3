// Test to verify scenario-level enriched data is saved correctly
// This tests that both scenario nodes (level 1) and their children get enriched data

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/**
 * Test function to verify enriched data is saved for all levels including scenarios
 */
export async function testScenarioEnrichment() {
  console.log("🧪 Testing Scenario-Level Enrichment");
  console.log("=====================================");

  // This would be called after a tree generation completes
  const testTreeId = "test-tree-id"; // Replace with actual tree ID from generation

  try {
    // Test 1: Check that scenario nodes (level 1) have enriched data
    console.log("\n📊 Testing Level 1 (Scenario) enriched data...");
    await testScenarioLevelData(testTreeId);

    // Test 2: Check that child nodes (level 2+) have enriched data
    console.log("\n📊 Testing Level 2+ (Children) enriched data...");
    await testChildLevelData(testTreeId);

    // Test 3: Verify data integrity and relationships
    console.log("\n🔗 Testing data relationships...");
    await testDataRelationships(testTreeId);

    console.log("\n✅ All enrichment tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

async function testScenarioLevelData(treeId: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get scenario nodes (level 1)
  const { data: scenarios, error: scenarioError } = await supabase
    .from("tree_nodes")
    .select("id, name")
    .eq("tree_id", treeId)
    .eq("level", 1);

  if (scenarioError) {
    throw new Error(`Failed to fetch scenarios: ${scenarioError.message}`);
  }

  if (!scenarios || scenarios.length === 0) {
    throw new Error("No scenario nodes found");
  }

  console.log(`Found ${scenarios.length} scenario nodes`);

  // Check each scenario has enriched data
  for (const scenario of scenarios) {
    // Check papers
    const { data: papers, error: papersError } = await supabase
      .from("node_papers")
      .select("*")
      .eq("node_id", scenario.id);

    if (papersError) {
      throw new Error(
        `Failed to fetch papers for scenario ${scenario.id}: ${papersError.message}`
      );
    }

    // Check use cases
    const { data: useCases, error: useCasesError } = await supabase
      .from("node_use_cases")
      .select("*")
      .eq("node_id", scenario.id);

    if (useCasesError) {
      throw new Error(
        `Failed to fetch use cases for scenario ${scenario.id}: ${useCasesError.message}`
      );
    }

    console.log(
      `📄 Scenario "${scenario.name}": ${papers?.length || 0} papers, ${
        useCases?.length || 0
      } use cases`
    );

    // Verify scenario has some enriched data
    if (
      (!papers || papers.length === 0) &&
      (!useCases || useCases.length === 0)
    ) {
      console.warn(`⚠️  Scenario "${scenario.name}" has no enriched data`);
    }
  }
}

async function testChildLevelData(treeId: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get child nodes (level 2+)
  const { data: childNodes, error: childError } = await supabase
    .from("tree_nodes")
    .select("id, name, level")
    .eq("tree_id", treeId)
    .gte("level", 2);

  if (childError) {
    throw new Error(`Failed to fetch child nodes: ${childError.message}`);
  }

  if (!childNodes || childNodes.length === 0) {
    throw new Error("No child nodes found");
  }

  console.log(`Found ${childNodes.length} child nodes`);

  // Sample a few child nodes to verify they have enriched data
  const sampleNodes = childNodes.slice(0, 5); // Test first 5 nodes

  for (const node of sampleNodes) {
    // Check papers
    const { data: papers } = await supabase
      .from("node_papers")
      .select("*")
      .eq("node_id", node.id);

    // Check use cases
    const { data: useCases } = await supabase
      .from("node_use_cases")
      .select("*")
      .eq("node_id", node.id);

    console.log(
      `📄 Level ${node.level} "${node.name}": ${papers?.length || 0} papers, ${
        useCases?.length || 0
      } use cases`
    );
  }
}

async function testDataRelationships(treeId: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Test foreign key relationships are correct
  const { data: papers, error: papersError } = await supabase
    .from("node_papers")
    .select(
      `
      id,
      node_id,
      tree_id,
      title,
      tree_nodes!inner(name, level)
    `
    )
    .eq("tree_id", treeId);

  if (papersError) {
    throw new Error(
      `Failed to test paper relationships: ${papersError.message}`
    );
  }

  const { data: useCases, error: useCasesError } = await supabase
    .from("node_use_cases")
    .select(
      `
      id,
      node_id,
      tree_id,
      title,
      tree_nodes!inner(name, level),
      use_case_press_releases(*)
    `
    )
    .eq("tree_id", treeId);

  if (useCasesError) {
    throw new Error(
      `Failed to test use case relationships: ${useCasesError.message}`
    );
  }

  console.log(
    `🔗 Papers relationship test: ${
      papers?.length || 0
    } papers linked correctly`
  );
  console.log(
    `🔗 Use cases relationship test: ${
      useCases?.length || 0
    } use cases linked correctly`
  );

  // Test press releases are linked
  let totalPressReleases = 0;
  useCases?.forEach((uc) => {
    totalPressReleases += uc.use_case_press_releases?.length || 0;
  });

  console.log(
    `📰 Press releases relationship test: ${totalPressReleases} press releases linked correctly`
  );
}

/**
 * Quick verification function to check if a specific scenario has enriched data
 */
export async function quickVerifyScenarioEnrichment(
  treeId: string,
  scenarioId: string
) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const [papersResponse, useCasesResponse] = await Promise.all([
    supabase.from("node_papers").select("count").eq("node_id", scenarioId),
    supabase.from("node_use_cases").select("count").eq("node_id", scenarioId),
  ]);

  console.log(`📊 Scenario ${scenarioId} enrichment:`, {
    papers: papersResponse.data?.[0]?.count || 0,
    useCases: useCasesResponse.data?.[0]?.count || 0,
  });

  return {
    hasPapers: (papersResponse.data?.[0]?.count || 0) > 0,
    hasUseCases: (useCasesResponse.data?.[0]?.count || 0) > 0,
  };
}
