import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Match {
  id: string;
  overall_score: number;
  candidates: {
    full_name: string;
    skills: string[] | null;
  };
  jobs: {
    title: string;
  };
  status: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    pendingMatches: 0,
    totalMatches: 0,
  });
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs count
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch candidates count
      const { count: candidatesCount } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });

      // Fetch matches
      const { data: matchesData, count: matchesCount } = await supabase
        .from('matches')
        .select(`
          *,
          candidates (full_name, skills),
          jobs (title)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(3);

      // Count pending matches
      const { count: pendingCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        activeJobs: jobsCount || 0,
        totalCandidates: candidatesCount || 0,
        pendingMatches: pendingCount || 0,
        totalMatches: matchesCount || 0,
      });

      setRecentMatches(matchesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: "Active Jobs",
      value: stats.activeJobs.toString(),
      icon: Briefcase,
      change: "View all",
      color: "text-primary",
      link: "/jobs"
    },
    {
      title: "Candidates",
      value: stats.totalCandidates.toString(),
      icon: Users,
      change: "Browse pool",
      color: "text-accent",
      link: "/candidates"
    },
    {
      title: "AI Matches",
      value: stats.totalMatches.toString(),
      icon: Zap,
      change: `${stats.pendingMatches} pending`,
      color: "text-warning",
      link: "/matching"
    },
    {
      title: "Total Matches",
      value: stats.totalMatches.toString(),
      icon: TrendingUp,
      change: "View all",
      color: "text-success",
      link: "/matching"
    },
  ];

  if (loading) {
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
          <h1 className="text-4xl font-bold mb-2">
            {role === 'candidate' ? 'Welcome' : 'AI Hiring Dashboard'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {role === 'candidate' 
              ? 'View your profile and job matches' 
              : 'Automated talent acquisition powered by AI'}
          </p>
        </div>

        {/* Stats Grid - Only for recruiters and admins */}
        {role !== 'candidate' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsConfig.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.title} to={stat.link}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Recent Matches - Only for recruiters and admins */}
        {role !== 'candidate' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Recent AI Matches</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Top candidates automatically matched to open positions
                  </p>
                </div>
                <Link to="/matching">
                  <Button>View All Matches</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentMatches.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Run AI matching to find the best candidates for your jobs
                  </p>
                  <Link to="/matching">
                    <Button>Go to AI Matching</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {match.candidates.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{match.candidates.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{match.jobs.title}</p>
                          </div>
                        </div>
                        {match.candidates.skills && match.candidates.skills.length > 0 && (
                          <div className="flex gap-2 ml-13">
                            {match.candidates.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {match.candidates.skills.length > 3 && (
                              <span className="px-2 py-1 text-xs text-muted-foreground">
                                +{match.candidates.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-success">{match.overall_score}%</div>
                          <div className="text-xs text-muted-foreground">Match Score</div>
                        </div>
                        <Link to="/matching">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Candidate View */}
        {role === 'candidate' && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Candidate Dashboard</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Your profile is active. Recruiters can now view your information and match you with relevant job opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
