
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry logic with exponential backoff
const retryWithBackoff = async (fn: () => Promise<Response>, maxRetries = 3) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fn();
      if (response.status === 429) {
        if (i === maxRetries) throw new Error('Rate limit exceeded after all retries');
        
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, i) * 1000;
        
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries) throw error;
      const waitTime = Math.pow(2, i) * 1000;
      console.log(`Request failed, retrying in ${waitTime}ms (attempt ${i + 1}/${maxRetries}):`, error.message);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
};

const TED_LAYER_PROMPT = `You are an **expert facilitator of TED (Technology Element Decomposition) hierarchical trees** and are fully versed in the **TED workshop technique** developed by JAXA & Ritsumeikan University.

Your task is to generate ONE SPECIFIC LAYER of a TED hierarchy based on the user's input and any previously generated layers.

### Layer Configuration
The current layer configuration is: Purpose → Function → Measure (3 layers)
- Purpose (目的): User-oriented goals expressed as verb + noun pairs
- Function (機能): Technical capabilities the artefact must perform to satisfy each purpose  
- Measure/Means (手段/技術): Concrete elements (materials, parts, algorithms, parameters, etc.) that realise each function

### Generation Rules for Single Layer
1. Generate ONLY the requested layer (Purpose, Function, or Measure)
2. Output every node name in the format **日本語訳((English phrase))**
3. Generate 3-5 nodes for the layer to ensure comprehensive coverage
4. Ensure siblings are mutually exclusive and collectively exhaustive (MECE)
5. Follow Why-How logic: child answers HOW parent is achieved, parent answers WHY child exists
6. Use appropriate abstraction level for the layer type

### Layer-Specific Guidelines

**Purpose Layer (目的):**
- Express as verb + noun pairs (e.g., "診断精度を向上する((Improve diagnostic accuracy))")
- Focus on user-oriented goals and benefits
- Abstract enough to encompass multiple technical approaches
- Answer "What value does this provide to users?"

**Function Layer (機能):**
- Technical capabilities and features required
- More concrete than purposes but still technology-agnostic
- Focus on "what the system must do" rather than "how it does it"
- Each function should directly support a parent purpose

**Measure Layer (手段/技術):**
- Concrete implementation elements
- Specific technologies, materials, algorithms, components
- Measurable and implementable items
- Direct technical solutions that realize parent functions

### Input Format
You will receive:
- query: The original user research query
- target_layer: The layer to generate (purpose, function, or measure)
- parent_nodes: Array of parent layer nodes (empty for purpose layer)
- context: Any additional context from previous generations

### Output Format
Return a JSON object with this exact structure:
{
  "layer": "purpose|function|measure",
  "nodes": [
    {
      "id": "unique_id",
      "name": "日本語名((English Name))",
      "description": "Detailed description in Japanese",
      "parent_id": "parent_node_id_or_null_for_purpose"
    }
  ],
  "generation_metadata": {
    "total_nodes": number,
    "abstraction_level": "high|medium|low",
    "coverage_note": "Brief explanation of coverage strategy"
  }
}

### Quality Requirements
- Each node must be distinct and non-overlapping with siblings
- Complete coverage of the parent scope (for function/measure layers)
- Appropriate abstraction level for the layer
- Clear Why-How relationships between layers
- Bilingual naming format consistently applied
- Comprehensive but not excessive (3-5 nodes typically optimal)

Focus on generating high-quality, TED-compliant nodes for the specified layer only.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, target_layer, parent_nodes = [], context = "" } = await req.json();

    console.log('Generating TED layer:', { target_layer, query, parent_nodes_count: parent_nodes.length });

    if (!query || !target_layer) {
      return new Response(
        JSON.stringify({ error: 'Query and target_layer are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key is missing');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contextPrompt = `
User Query: "${query}"
Target Layer: ${target_layer}
${parent_nodes.length > 0 ? `Parent Nodes: ${JSON.stringify(parent_nodes, null, 2)}` : 'This is the root Purpose layer.'}
${context ? `Additional Context: ${context}` : ''}

Generate the ${target_layer} layer following TED methodology.
    `;

    const response = await retryWithBackoff(async () => {
      return await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: TED_LAYER_PROMPT },
            { role: 'user', content: contextPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, response.statusText, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate TED layer', 
          details: `OpenAI API returned ${response.status}: ${response.statusText}`,
          openai_error: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI response received for layer generation');

    const generatedContent = data.choices?.[0]?.message?.content;
    
    if (!generatedContent) {
      console.error('No content in OpenAI response:', data);
      return new Response(
        JSON.stringify({ error: 'No content received from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Try to parse JSON from the response
    let layerData;
    try {
      layerData = JSON.parse(generatedContent);
    } catch (e) {
      // If JSON parsing fails, extract JSON from markdown or other formatting
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          layerData = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse extracted JSON:', parseError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to parse OpenAI response as JSON',
              raw_content: generatedContent
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        console.error('No JSON found in OpenAI response:', generatedContent);
        return new Response(
          JSON.stringify({ 
            error: 'No valid JSON found in OpenAI response',
            raw_content: generatedContent
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate the response structure
    if (!layerData.layer || !layerData.nodes || !Array.isArray(layerData.nodes)) {
      console.error('Invalid layer data structure:', layerData);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid layer data structure received from OpenAI',
          received_data: layerData
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        layer_data: layerData,
        raw_response: generatedContent 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ted-layer function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
