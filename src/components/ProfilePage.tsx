import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Mail, 
  MessageSquare, 
  UserPlus,
  Github,
  Linkedin,
  Globe,
  Star,
  Award,
  BookOpen
} from "lucide-react";

export function ProfilePage() {
  const skills = [
    { name: "React", level: "Expert", color: "primary" },
    { name: "TypeScript", level: "Advanced", color: "secondary" },
    { name: "Python", level: "Intermediate", color: "success" },
    { name: "Node.js", level: "Advanced", color: "primary" },
    { name: "UI/UX Design", level: "Beginner", color: "warning" }
  ];

  const wantToLearn = [
    "Machine Learning",
    "DevOps",
    "Mobile Development",
    "Blockchain",
    "Data Science"
  ];

  const projects = [
    {
      title: "EcoTracker",
      description: "Carbon footprint tracking app",
      tech: ["React", "Node.js", "MongoDB"],
      team: 4,
      status: "In Progress"
    },
    {
      title: "StudyBuddy AI",
      description: "AI-powered study companion",
      tech: ["Python", "TensorFlow", "React"],
      team: 3,
      status: "Completed"
    }
  ];

  const achievements = [
    { title: "Hackathon Winner", description: "1st place at TechCrunch Disrupt", date: "Nov 2024" },
    { title: "Open Source Contributor", description: "50+ contributions to React ecosystem", date: "Ongoing" },
    { title: "Team Leader", description: "Led 5 successful project teams", date: "2024" }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold">Alex Student</h1>
                <p className="text-xl text-muted-foreground">Computer Science Major</p>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Stanford University, CA</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Graduating May 2025</span>
                </div>
              </div>
            </div>

            {/* Bio & Actions */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Passionate computer science student with a love for building innovative solutions. 
                  Experienced in full-stack development and always eager to collaborate on impactful projects. 
                  Looking to connect with like-minded students for hackathons and learning opportunities.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="hero">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
                <Button variant="outline">
                  Invite to Team
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skills */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline">{skill.level}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-primary transition-all duration-300`}
                      style={{ 
                        width: skill.level === 'Expert' ? '90%' : 
                               skill.level === 'Advanced' ? '75%' : 
                               skill.level === 'Intermediate' ? '60%' : '30%' 
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Want to Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {wantToLearn.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project) => (
              <div key={project.title} className="p-4 rounded-lg bg-background/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Team of {project.team} members
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Projects
            </Button>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="p-4 rounded-lg bg-background/50 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mt-1">
                    <Award className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}