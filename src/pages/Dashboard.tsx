import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    { 
      title: "Active Jobs", 
      value: "12", 
      icon: Briefcase, 
      change: "+3 this week",
      color: "text-primary"
    },
    { 
      title: "Candidates", 
      value: "248", 
      icon: Users, 
      change: "+45 this week",
      color: "text-accent"
    },
    { 
      title: "AI Matches", 
      value: "89", 
      icon: Zap, 
      change: "+22 pending",
      color: "text-warning"
    },
    { 
      title: "Placements", 
      value: "34", 
      icon: TrendingUp, 
      change: "+8 this month",
      color: "text-success"
    },
  ];

  const recentMatches = [
    {
      candidate: "Sarah Chen",
      job: "Senior React Developer",
      score: 94,
      skills: ["React", "TypeScript", "Node.js"],
      status: "pending"
    },
    {
      candidate: "Michael Rodriguez",
      job: "DevOps Engineer",
      score: 91,
      skills: ["AWS", "Kubernetes", "Docker"],
      status: "interview"
    },
    {
      candidate: "Emily Johnson",
      job: "Product Manager",
      score: 88,
      skills: ["Agile", "Product Strategy", "Analytics"],
      status: "pending"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Hiring Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Automated talent acquisition powered by AI
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
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
            );
          })}
        </div>

        {/* Recent AI Matches */}
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
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {match.candidate.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{match.candidate}</h3>
                        <p className="text-sm text-muted-foreground">{match.job}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-13">
                      {match.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">{match.score}%</div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
