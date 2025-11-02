import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Jobs = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Corp",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      candidates: 23,
      status: "active"
    },
    {
      id: 2,
      title: "DevOps Engineer",
      company: "Cloud Systems Inc",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "5 days ago",
      candidates: 18,
      status: "active"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Innovate Labs",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$140k - $170k",
      posted: "1 week ago",
      candidates: 31,
      status: "active"
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Positions</h1>
            <p className="text-muted-foreground text-lg">
              Manage and create job openings
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="e.g., Senior React Developer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Remote" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input id="salary" placeholder="e.g., $120k - $150k" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Detailed job description..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Required skills and qualifications..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">Post Job</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Posted {job.posted}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{job.candidates} candidates</span>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Candidates</Button>
                    <Button size="sm">AI Match</Button>
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

export default Jobs;
