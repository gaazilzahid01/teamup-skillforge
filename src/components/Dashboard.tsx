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
  Target
} from "lucide-react";

export function Dashboard() {
  const friends = [
    { name: "Sarah Chen", status: "online", major: "Design", avatar: "SC" },
    { name: "Mike Johnson", status: "offline", major: "Engineering", avatar: "MJ" },
    { name: "Emma Davis", status: "online", major: "Computer Science", avatar: "ED" },
    { name: "Alex Rivera", status: "away", major: "Data Science", avatar: "AR" },
  ];

  const teams = [
    {
      name: "EcoTracker App",
      members: 4,
      deadline: "Dec 15",
      progress: 75,
      role: "Frontend Dev"
    },
    {
      name: "AI Study Assistant",
      members: 3,
      deadline: "Jan 8",
      progress: 30,
      role: "ML Engineer"
    }
  ];

  const events = [
    {
      name: "Winter Hackathon 2024",
      date: "Dec 20-22",
      participants: 250,
      timeLeft: "5 days"
    },
    {
      name: "React Workshop",
      date: "Dec 18",
      participants: 45,
      timeLeft: "3 days"
    }
  ];

  const recommendations = [
    {
      name: "Jordan Kim",
      skills: ["React", "Node.js", "Design"],
      match: 95,
      avatar: "JK"
    },
    {
      name: "Priya Patel", 
      skills: ["Python", "ML", "Data Analysis"],
      match: 88,
      avatar: "PP"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Alex! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your teams and projects.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">250</p>
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
            {friends.map((friend) => (
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
            ))}
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
            {teams.map((team) => (
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
            ))}
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
              {events.map((event) => (
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
              ))}
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
              {recommendations.map((person) => (
                <div key={person.name} className="p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-secondary text-secondary-foreground text-xs">
                        {person.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{person.name}</p>
                      <Badge variant="outline" className="text-xs">{person.match}% match</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {person.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
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