import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  MapPin,
  Star,
  Clock,
  Filter,
  Plus
} from "lucide-react";

type Team = {
  teamid: string;
  name: string;
  description: string | null;
  type: string | null;
  difficulty: string | null;
  members: string[] | null;
  neededroles: string[] | null;
  skills: string[] | null;
  location: string | null;
  deadline: string | null;
  tags: string[] | null;
  created_by: string | null;
  event_id: string | null;
};

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("createdat", { ascending: false });

    if (error) {
      console.error("Error fetching teams:", error);
      setError("Could not load teams");
    } else {
      setTeams(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teams & Events</h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing teams to join or exciting events to participate in.
          </p>
        </div>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search teams, skills, or projects..." 
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Teams</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Loading teams...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500 text-center py-6">{error}</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No teams available right now
          </p>
        ) : (
          <ScrollArea className="h-[70vh]">
            <div className="grid lg:grid-cols-2 gap-6 pr-4">
            {teams.map((team) => (
              <Card key={team.teamid} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {team.type && <Badge variant="outline">{team.type}</Badge>}
                        {team.difficulty && <Badge variant="secondary">{team.difficulty}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {team.description && (
                    <p className="text-muted-foreground">{team.description}</p>
                  )}

                  {/* Team Members */}
                  {team.members && team.members.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Team Members ({team.members.length})</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                          {team.neededroles && team.neededroles.length > 0 && 
                            ` · ${team.neededroles.length} role${team.neededroles.length !== 1 ? 's' : ''} needed`
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Needed Roles */}
                  {team.neededroles && team.neededroles.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.neededroles.map((role: string, idx: number) => (
                          <Badge key={`${role}-${idx}`} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {team.skills && team.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.skills.map((skill: string, idx: number) => (
                          <Badge key={`${skill}-${idx}`} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  {(team.location || team.deadline) && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {team.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {team.location}
                        </div>
                      )}
                      {team.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due {new Date(team.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {team.tags && team.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {team.tags.map((tag: string, idx: number) => (
                        <Badge key={`${tag}-${idx}`} variant="outline" className="text-xs bg-primary/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="hero" className="flex-1">
                      Join Team
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        )}
      </div>
    </div>
  );
}
