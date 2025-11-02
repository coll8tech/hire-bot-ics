import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { jobId } = await req.json();
    
    console.log('Fetching job details for:', jobId);
    
    // Get job details
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (jobError || !job) {
      throw new Error('Job not found');
    }

    console.log('Fetching candidates...');
    
    // Get all available candidates
    const { data: candidates, error: candidatesError } = await supabaseClient
      .from('candidates')
      .select('*')
      .eq('status', 'available');
    
    if (candidatesError) {
      throw new Error('Failed to fetch candidates');
    }

    console.log(`Found ${candidates?.length || 0} candidates`);

    // Use AI to analyze and score matches
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const matches = [];

    for (const candidate of candidates || []) {
      console.log(`Analyzing match for candidate: ${candidate.full_name}`);
      
      const prompt = `You are an AI recruiter analyzing candidate-job matches.

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Requirements: ${job.requirements || 'Not specified'}
- Location: ${job.location || 'Not specified'}

Candidate Details:
- Name: ${candidate.full_name}
- Title: ${candidate.title || 'Not specified'}
- Experience: ${candidate.experience_years || 0} years
- Skills: ${candidate.skills?.join(', ') || 'Not specified'}
- Location: ${candidate.location || 'Not specified'}

Analyze this match and provide:
1. An overall match score (0-100)
2. Individual scores for: skill match, experience match, location match
3. 3-5 specific reasons why this is a good match (or not)
4. Any potential gaps or concerns

Respond in JSON format:
{
  "overallScore": <number>,
  "skillMatch": <number>,
  "experienceMatch": <number>,
  "locationMatch": <number>,
  "rationale": ["reason1", "reason2", ...],
  "gaps": ["gap1", "gap2", ...]
}`;

      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error('AI API error:', aiResponse.status, errorText);
          continue;
        }

        const aiData = await aiResponse.json();
        const aiContent = aiData.choices[0].message.content;
        
        // Extract JSON from response
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('No JSON found in AI response');
          continue;
        }
        
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Store match in database
        const { error: insertError } = await supabaseClient
          .from('matches')
          .upsert({
            job_id: jobId,
            candidate_id: candidate.id,
            overall_score: analysis.overallScore,
            skill_match_score: analysis.skillMatch,
            experience_score: analysis.experienceMatch,
            semantic_similarity_score: analysis.locationMatch,
            assessment_score: 0,
            ai_rationale: analysis.rationale,
            gaps: analysis.gaps,
            status: 'pending',
            created_by: user.id,
          }, {
            onConflict: 'job_id,candidate_id'
          });

        if (insertError) {
          console.error('Error inserting match:', insertError);
        } else {
          matches.push({
            candidateId: candidate.id,
            candidateName: candidate.full_name,
            score: analysis.overallScore,
            rationale: analysis.rationale,
            gaps: analysis.gaps
          });
        }
      } catch (error) {
        console.error(`Error processing candidate ${candidate.id}:`, error);
      }
    }

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    console.log(`Completed matching, found ${matches.length} matches`);

    return new Response(
      JSON.stringify({ 
        success: true,
        matches: matches.slice(0, 10), // Return top 10
        totalCandidates: candidates?.length || 0,
        totalMatches: matches.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-match-candidates:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
