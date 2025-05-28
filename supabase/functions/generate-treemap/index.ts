
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
        JSON.stringify({ treemapData: fallbackData, warning: 'OpenAI API key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate treemap data using OpenAI with retry logic
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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTreemapDataWithAI(query: string, scenario?: string) {
  const prompt = scenario 
    ? `Based on the research query "${query}" and scenario "${scenario}", generate 4-6 specific research areas with their relative importance (as percentages that sum to 100). Return a JSON array of objects with properties: name (research area), size (percentage), fill (hex color), papers (estimated number of papers). Focus on actual research domains, methodologies, or application areas.`
    : `Based on the research query "${query}", generate 4-6 broad research areas with their relative importance (as percentages that sum to 100). Return a JSON array of objects with properties: name (research area), size (percentage), fill (hex color), papers (estimated number of papers). Focus on major research categories or domains.`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt}/${maxRetries}`);
      
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

      if (response.status === 429) {
        // Rate limited - wait before retry
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Rate limited (429). Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        
        if (attempt < maxRetries) {
          await sleep(waitTime);
          continue;
        } else {
          throw new Error(`OpenAI API rate limited after ${maxRetries} attempts`);
        }
      }

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }
      
      const generatedContent = data.choices[0].message.content;
      console.log('OpenAI response received successfully:', generatedContent.substring(0, 200) + '...');
      
      // Parse the JSON response
      const treemapData = JSON.parse(generatedContent);
      
      if (!Array.isArray(treemapData)) {
        throw new Error('OpenAI did not return a valid array');
      }
      
      // Validate and ensure proper structure
      const validatedData = treemapData.map((item: any, index: number) => ({
        name: item.name || `研究エリア ${index + 1}`,
        size: Math.max(5, Math.min(50, item.size || 20)), // Ensure reasonable sizes
        fill: item.fill || ['#4C7CFC', '#8D84C6', '#A94CF7', '#4A3D78'][index % 4],
        papers: item.papers || Math.floor((item.size || 20) * 2) || 20
      }));

      console.log('Generated treemap data successfully:', validatedData);
      return validatedData;
      
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenAI API attempt ${attempt} failed:`, error);
      
      // If it's a JSON parsing error or other non-retriable error, don't retry
      if (error instanceof SyntaxError || (error as Error).message.includes('Invalid response format')) {
        console.log('Non-retriable error encountered, falling back to static data');
        break;
      }
      
      // If this is the last attempt, we'll fall through to the fallback
      if (attempt === maxRetries) {
        console.log('All retry attempts exhausted, falling back to static data');
      }
    }
  }

  // All retries failed, use fallback data
  console.error('OpenAI API failed after all retries, using fallback data. Last error:', lastError?.message);
  return generateFallbackTreemapData(query, scenario);
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
