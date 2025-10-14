"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

type Team = {
  teamid: string
  name: string
  members: string[]
  created_by: string
  event_id: string
}

export default function JoinTeamPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("teams")
        .select("teamid, name, members, created_by, event_id")
        .eq("event_id", eventId)

      if (error) {
        console.error("Error fetching teams:", error)
        setError("Could not load teams")
      } else {
        setTeams(data || [])
      }

      setLoading(false)
    }

    fetchTeams()
  }, [eventId])

  const handleJoinTeam = async (teamId: string, members: string[]) => {
    if (!user) {
      alert("You must be logged in to join a team.")
      return
    }

    if (members.includes(user.id)) {
      alert("You're already in this team!")
      return
    }

    setJoining(teamId)

    const updatedMembers = [...members, user.id]
    const { error } = await supabase
      .from("teams")
      .update({ members: updatedMembers })
      .eq("teamid", teamId)

    if (error) {
      console.error("Error joining team:", error)
      alert("Error joining team")
    } else {
      alert("Joined team successfully!")
      navigate("/events") // go back to EventsPage
    }

    setJoining(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Join an Existing Team
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading teams...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : teams.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No teams found for this event.
            </p>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="flex flex-col gap-4">
                {teams.map((team) => (
                  <Card key={team.teamid} className="p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm text-gray-500">
                          Members: {team.members?.length || 0}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleJoinTeam(team.teamid, team.members || [])}
                        disabled={joining === team.teamid}
                        className="w-full md:w-auto"
                      >
                        {joining === team.teamid ? "Joining..." : "Join Team"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full mt-4 text-gray-500"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
