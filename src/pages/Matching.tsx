import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, TrendingUp, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
}

interface Match {
  id: string;
  job_id: string;
  candidate_id: string;
  overall_score: number;
  skill_match_score: number | null;
  experience_score: number | null;
  semantic_similarity_score: number | null;
  assessment_score: number | null;
  ai_rationale: string[] | null;
  gaps: string[] | null;
  jobs: { title: string; company: string };
  candidates: { full_name: string; title: string | null };
}

const Matching = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchMatches(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, company')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      if (data && data.length > 0 && !selectedJobId) {
        setSelectedJobId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (jobId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          jobs (title, company),
          candidates (full_name, title)
        `)
        .eq('job_id', jobId)
        .order('overall_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runAIMatching = async () => {
    if (!selectedJobId) return;

    setMatching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-match-candidates', {
        body: { jobId: selectedJobId }
      });

      if (error) throw error;

      toast({
        title: "AI Matching Complete",
        description: `Found ${data.totalMatches} potential matches`,
      });

      fetchMatches(selectedJobId);
    } catch (error) {
      console.error('Error running AI matching:', error);
      toast({
        title: "Error",
        description: "Failed to run AI matching",
        variant: "destructive"
      });
    } finally {
      setMatching(false);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold">AI-Powered Matching</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Intelligent candidate-job matching with explainable AI
          </p>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Zap className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No active jobs</h3>
              <p className="text-muted-foreground">Post a job first to start matching candidates</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Job for Matching</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a job..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={runAIMatching} disabled={matching} className="gap-2">
                  {matching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Matching...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run AI Matching
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : matches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Zap className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Click "Run AI Matching" to find the best candidates for this job
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8">
                {matches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                              {match.candidates.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{match.candidates.full_name}</CardTitle>
                              <p className="text-muted-foreground">{match.candidates.title || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Matched to:</span>
                            <span className="font-semibold">{match.jobs.title}</span>
                            <span className="text-muted-foreground">at {match.jobs.company}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-bold text-success mb-1">
                            {match.overall_score}%
                          </div>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {match.overall_score >= 90 ? 'Excellent' : match.overall_score >= 75 ? 'Good' : 'Fair'} Match
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-accent" />
                            Score Breakdown
                          </h3>
                          <div className="space-y-4">
                            {match.skill_match_score !== null && (
                              <div>
                                <div className="flex justify-between mb-2 text-sm">
                                  <span className="text-muted-foreground">Skill Match</span>
                                  <span className="font-semibold">{match.skill_match_score}%</span>
                                </div>
                                <Progress value={match.skill_match_score} className="h-2" />
                              </div>
                            )}
                            {match.experience_score !== null && (
                              <div>
                                <div className="flex justify-between mb-2 text-sm">
                                  <span className="text-muted-foreground">Experience Match</span>
                                  <span className="font-semibold">{match.experience_score}%</span>
                                </div>
                                <Progress value={match.experience_score} className="h-2" />
                              </div>
                            )}
                            {match.semantic_similarity_score !== null && (
                              <div>
                                <div className="flex justify-between mb-2 text-sm">
                                  <span className="text-muted-foreground">Location Match</span>
                                  <span className="font-semibold">{match.semantic_similarity_score}%</span>
                                </div>
                                <Progress value={match.semantic_similarity_score} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-accent" />
                            AI Rationale
                          </h3>
                          {match.ai_rationale && match.ai_rationale.length > 0 ? (
                            <div className="space-y-3 mb-6">
                              {match.ai_rationale.map((reason, i) => (
                                <div key={i} className="flex gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{reason}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No rationale available</p>
                          )}

                          {match.gaps && match.gaps.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-2 flex items-center gap-2 text-warning">
                                <AlertCircle className="h-4 w-4" />
                                Potential Gaps
                              </h4>
                              <div className="space-y-2">
                                {match.gaps.map((gap, i) => (
                                  <div key={i} className="text-sm text-muted-foreground pl-6">
                                    • {gap}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Matching;
