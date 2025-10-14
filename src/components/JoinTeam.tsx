"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

type Team = {
  id: string
  team_name: string
  members: string[]
  event_id: string
}

export default function JoinTeamPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      const { data, error } = await supabase
        .from("teams")
        .select("id, team_name, members, event_id")
        .eq("event_id", eventId)

      if (!error && data) setTeams(data)
      setLoading(false)
    }

    fetchTeams()
  }, [eventId])

  const handleJoinTeam = async (teamId: string, members: string[]) => {
    if (!user) return

    const updatedMembers = [...new Set([...members, user.id])]
    const { error } = await supabase
      .from("teams")
      .update({ members: updatedMembers })
      .eq("id", teamId)

    if (error) {
      console.error(error)
      alert("Failed to join team")
    } else {
      alert("Joined team successfully!")
      navigate("/events")
    }
  }

  if (loading) return <p className="text-center p-6 text-gray-500">Loading teams...</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Join a Team
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {teams.length === 0 ? (
            <p className="text-gray-500 text-center">No teams available for this event yet.</p>
          ) : (
            teams.map((team) => (
              <Card key={team.id} className="p-4 flex justify-between items-center">
                <span>{team.team_name}</span>
                <Button onClick={() => handleJoinTeam(team.id, team.members)}>
                  Join
                </Button>
              </Card>
            ))
          )}

          <Button variant="ghost" onClick={() => navigate(-1)} className="w-full text-gray-500 mt-4">
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
