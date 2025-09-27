import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  UserPlus,
  Zap,
  Target,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Dashboard() {
  const { user } = useAuth();
  const [dbError, setDbError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    // Simulate database connection attempts
    const loadDashboardData = async () => {
      try {
        // This would be where we fetch from UserDetails, EventDetails, and ChatLogs tables
        // For now, we'll show the database connection error
        setDbError("Could not connect to the database. UserDetails, EventDetails, and ChatLogs tables are not available.");
        
        // Fallback: show empty state instead of placeholder data
        setUserData(null);
        setTeams([]);
        setEvents([]);
        setFriends([]);
      } catch (error) {
        setDbError("Database connection failed. Please try again later.");
      }
    };

    loadDashboardData();
  }, []);

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your teams and projects.
        </p>
      </div>

      {/* Database Error Alert */}
      {dbError && (
        <Alert className="border-warning bg-warning/10">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            {dbError}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friends.length}</p>
                <p className="text-sm text-muted-foreground">Friends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Active Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Projects Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Skill Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Friends Panel */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No friends yet</p>
                <p className="text-sm text-muted-foreground">Connect with other students to get started</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {friend.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      friend.status === 'online' ? 'bg-success' : 
                      friend.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{friend.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{friend.major}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Find Friends
            </Button>
          </CardContent>
        </Card>

        {/* Teams Panel */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active teams</p>
                <p className="text-sm text-muted-foreground">Join a team to start collaborating</p>
              </div>
            ) : (
              teams.map((team) => (
                <div key={team.name} className="p-4 rounded-lg bg-background/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-muted-foreground">{team.members} members</p>
                    </div>
                    <Badge variant="secondary">{team.role}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{team.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Due {team.deadline}
                    </div>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full">
              Join New Team
            </Button>
          </CardContent>
        </Card>

        {/* Events & Recommendations */}
        <div className="space-y-6">
          {/* Events */}
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming events</p>
                  <p className="text-sm text-muted-foreground">Check back for hackathons and workshops</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.name} className="p-3 rounded-lg bg-background/50">
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        {event.participants} participants
                      </span>
                      <Badge variant="outline">{event.timeLeft}</Badge>
                    </div>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recommendations</p>
                <p className="text-sm text-muted-foreground">Complete your profile to get personalized suggestions</p>
              </div>
              <Button variant="outline" className="w-full">
                See More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}