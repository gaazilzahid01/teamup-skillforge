"use client"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

type EventDetail = {
  eventid: string
  name: string
  description: string
  deadline: string
  joined_by_individuals: string[]
}

type Team = {
  id: string
  team_name: string
  members: string[]
}

export default function ViewEventPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      // Fetch event
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("eventid", eventId)
        .single()

      setEvent(eventData)

      // Fetch teams for this event
      const { data: teamsData } = await supabase
        .from("teams")
        .select("*")
        .eq("event_id", eventId)

      setTeams(teamsData || [])
      setLoading(false)
    }

    fetchData()
  }, [eventId])

  if (loading) return <p className="p-6">Loading...</p>
  if (!event) return <p className="p-6 text-red-500">Event not found</p>

  const userTeam = teams.find((t) => t.members.includes(user.id))

  return (
    <div className="flex flex-col p-6 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{event.description}</p>
          <p className="mb-2">
            📅 Deadline: {new Date(event.deadline).toLocaleDateString()}
          </p>
          <p className="mb-2">
            👤 Your team: {userTeam ? userTeam.team_name : "None / Individual"}
          </p>
          <hr className="my-4" />
          <p className="mb-2 font-semibold">Other Teams:</p>
          <ul className="mb-4">
            {teams
              .filter((t) => t.id !== userTeam?.id)
              .map((t) => (
                <li key={t.id}>{t.team_name} ({t.members.length} members)</li>
              ))}
          </ul>
          <p className="mb-2 font-semibold">Individuals Registered:</p>
          <ul>
            {event.joined_by_individuals?.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
