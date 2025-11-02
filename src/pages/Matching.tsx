import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

const Matching = () => {
  const matches = [
    {
      job: {
        title: "Senior React Developer",
        company: "Tech Corp"
      },
      candidate: {
        name: "Sarah Chen",
        title: "Senior Frontend Developer"
      },
      overallScore: 94,
      breakdown: {
        skillMatch: 95,
        experienceMatch: 92,
        semanticSimilarity: 88,
        assessmentScore: 96
      },
      aiRationale: [
        "Has 8 years React experience with production apps",
        "Strong TypeScript and modern tooling expertise",
        "Passed technical assessment with 96% score",
        "Located in same timezone (SF)"
      ],
      gaps: ["AWS certification would strengthen profile"]
    },
    {
      job: {
        title: "DevOps Engineer",
        company: "Cloud Systems Inc"
      },
      candidate: {
        name: "Michael Rodriguez",
        title: "Senior DevOps Engineer"
      },
      overallScore: 91,
      breakdown: {
        skillMatch: 93,
        experienceMatch: 88,
        semanticSimilarity: 90,
        assessmentScore: 94
      },
      aiRationale: [
        "6 years AWS + Kubernetes expertise",
        "Led infrastructure automation projects",
        "Strong CI/CD pipeline experience",
        "Excellent communication skills noted"
      ],
      gaps: ["Limited Terraform experience"]
    },
    {
      job: {
        title: "Product Manager",
        company: "Innovate Labs"
      },
      candidate: {
        name: "Emily Johnson",
        title: "Senior Product Manager"
      },
      overallScore: 88,
      breakdown: {
        skillMatch: 85,
        experienceMatch: 95,
        semanticSimilarity: 84,
        assessmentScore: 88
      },
      aiRationale: [
        "10 years product management experience",
        "Strong B2B SaaS background",
        "Data-driven decision making approach",
        "Led multiple successful launches"
      ],
      gaps: ["Limited fintech experience"]
    },
  ];

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

        <div className="grid gap-8">
          {matches.map((match, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                        {match.candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{match.candidate.name}</CardTitle>
                        <p className="text-muted-foreground">{match.candidate.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Matched to:</span>
                      <span className="font-semibold">{match.job.title}</span>
                      <span className="text-muted-foreground">at {match.job.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-success mb-1">
                      {match.overallScore}%
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Excellent Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Score Breakdown */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Score Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Skill Match</span>
                          <span className="font-semibold">{match.breakdown.skillMatch}%</span>
                        </div>
                        <Progress value={match.breakdown.skillMatch} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Experience Match</span>
                          <span className="font-semibold">{match.breakdown.experienceMatch}%</span>
                        </div>
                        <Progress value={match.breakdown.experienceMatch} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Semantic Similarity</span>
                          <span className="font-semibold">{match.breakdown.semanticSimilarity}%</span>
                        </div>
                        <Progress value={match.breakdown.semanticSimilarity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Assessment Score</span>
                          <span className="font-semibold">{match.breakdown.assessmentScore}%</span>
                        </div>
                        <Progress value={match.breakdown.assessmentScore} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* AI Rationale */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-accent" />
                      AI Rationale
                    </h3>
                    <div className="space-y-3 mb-6">
                      {match.aiRationale.map((reason, i) => (
                        <div key={i} className="flex gap-2">
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{reason}</span>
                        </div>
                      ))}
                    </div>

                    {match.gaps.length > 0 && (
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

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button className="flex-1">Schedule Interview</Button>
                  <Button variant="outline" className="flex-1">View Full Profile</Button>
                  <Button variant="outline">Send Assessment</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matching;
