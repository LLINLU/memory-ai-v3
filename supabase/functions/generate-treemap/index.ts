
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, scenario, context } = await req.json();
    
    console.log('Generate treemap request:', { query, scenario, context });

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      // Fallback to static data if no API key
      const fallbackData = generateFallbackTreemapData(query, scenario);
      return new Response(
        JSON.stringify({ treemapData: fallbackData }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate treemap data using OpenAI
    const treemapData = await generateTreemapDataWithAI(query, scenario);

    return new Response(
      JSON.stringify({ treemapData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating treemap:', error);
    
    // Fallback to static data on error
    const { query, scenario } = await req.json().catch(() => ({ query: 'default', scenario: null }));
    const fallbackData = generateFallbackTreemapData(query, scenario);
    
    return new Response(
      JSON.stringify({ treemapData: fallbackData, warning: 'Used fallback data due to error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});

async function generateTreemapDataWithAI(query: string, scenario?: string) {
  const prompt = scenario 
    ? `Based on the research query "${query}" and scenario "${scenario}", generate 4-6 specific research areas with their relative importance (as percentages that sum to 100). Return a JSON array of objects with properties: name (research area), size (percentage), fill (hex color), papers (estimated number of papers). Focus on actual research domains, methodologies, or application areas.`
    : `Based on the research query "${query}", generate 4-6 broad research areas with their relative importance (as percentages that sum to 100). Return a JSON array of objects with properties: name (research area), size (percentage), fill (hex color), papers (estimated number of papers). Focus on major research categories or domains.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a research analyst. Generate research area data as valid JSON only, no additional text. Use colors from this palette: #4C7CFC, #8D84C6, #A94CF7, #4A3D78, #6B73FF, #9C88FF'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('OpenAI response:', generatedContent);
    
    // Parse the JSON response
    const treemapData = JSON.parse(generatedContent);
    
    // Validate and ensure proper structure
    return treemapData.map((item: any, index: number) => ({
      name: item.name || `研究エリア ${index + 1}`,
      size: Math.max(5, Math.min(50, item.size || 20)), // Ensure reasonable sizes
      fill: item.fill || ['#4C7CFC', '#8D84C6', '#A94CF7', '#4A3D78'][index % 4],
      papers: item.papers || Math.floor(item.size * 2) || 20
    }));
    
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    // Fallback to static data if AI fails
    return generateFallbackTreemapData(query, scenario);
  }
}

function generateFallbackTreemapData(query: string, scenario?: string) {
  // Generate fallback treemap data based on query and scenario
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
