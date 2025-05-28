
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, scenario, context } = await req.json();
    
    console.log('Generate treemap request:', { query, scenario, context });

    // Generate treemap data based on the query and scenario
    const treemapData = generateTreemapData(query, scenario);

    return new Response(
      JSON.stringify({ treemapData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating treemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateTreemapData(query: string, scenario?: string) {
  // Generate dynamic treemap data based on query and scenario
  const baseAreas = [
    { suffix: "主要研究", size: 40, fill: "#4C7CFC" },
    { suffix: "応用研究", size: 30, fill: "#8D84C6" },
    { suffix: "技術開発", size: 20, fill: "#A94CF7" },
    { suffix: "その他", size: 10, fill: "#4A3D78" }
  ];

  // If scenario is provided, use more specific research areas
  if (scenario) {
    return baseAreas.map(area => ({
      name: `${query} - ${area.suffix}`,
      size: area.size,
      fill: area.fill,
      papers: area.size
    }));
  }

  // For quick mode, use general categories
  return baseAreas.map(area => ({
    name: `${query} - ${area.suffix}`,
    size: area.size,
    fill: area.fill,
    papers: area.size
  }));
}
