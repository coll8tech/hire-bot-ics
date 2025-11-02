import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MapPin, Briefcase } from "lucide-react";

const Candidates = () => {
  const candidates = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Frontend Developer",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      experience: "8 years",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      status: "available",
      matchScore: 94
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "DevOps Engineer",
      email: "m.rodriguez@email.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      experience: "6 years",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      status: "available",
      matchScore: 91
    },
    {
      id: 3,
      name: "Emily Johnson",
      title: "Product Manager",
      email: "emily.j@email.com",
      phone: "+1 (555) 345-6789",
      location: "New York, NY",
      experience: "10 years",
      skills: ["Agile", "Product Strategy", "Analytics", "Roadmapping", "UX"],
      status: "interviewing",
      matchScore: 88
    },
    {
      id: 4,
      name: "David Kim",
      title: "Full Stack Developer",
      email: "david.kim@email.com",
      phone: "+1 (555) 456-7890",
      location: "Seattle, WA",
      experience: "5 years",
      skills: ["React", "Python", "Django", "PostgreSQL", "Redis"],
      status: "available",
      matchScore: 86
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Candidate Pool</h1>
          <p className="text-muted-foreground text-lg">
            Browse and manage your talent database
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, skills, or experience..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{candidate.name}</CardTitle>
                      <p className="text-muted-foreground mb-2">{candidate.title}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {candidate.experience}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-success mb-1">
                      {candidate.matchScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">AI Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={
                      candidate.status === "available" 
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {candidate.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm">Match to Job</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
