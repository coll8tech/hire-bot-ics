import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Target, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  const location = useLocation();
  const { user, role, signOut } = useAuth();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/jobs", label: "Jobs", icon: Briefcase, roles: ['recruiter', 'admin'] },
    { path: "/candidates", label: "Candidates", icon: Users, roles: ['recruiter', 'admin'] },
    { path: "/matching", label: "AI Matching", icon: Target, roles: ['recruiter', 'admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (role && item.roles.includes(role))
  );

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
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {filteredNavItems.map((item) => {
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
            
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="text-right">
                <div className="text-sm font-medium">{user?.email}</div>
                {role && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {role}
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
