import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Target, BarChart3 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/candidates", label: "Candidates", icon: Users },
    { path: "/matching", label: "AI Matching", icon: Target },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              C8
            </div>
            <span className="text-xl font-bold">Coll8 AI Hiring</span>
          </div>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
